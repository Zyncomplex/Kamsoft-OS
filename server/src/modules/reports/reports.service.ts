import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { LeadStatus, OrderStatus, QAStatus, ShipmentStatus } from '../../types';

@Injectable()
export class ReportsService {
  constructor(private readonly supabase: SupabaseService) {}

  private getDateRange(period?: string) {
    const now = new Date();
    const range = new Date();
    switch (period) {
      case '7d': range.setDate(now.getDate() - 7); break;
      case '30d': range.setDate(now.getDate() - 30); break;
      case '90d': range.setDate(now.getDate() - 90); break;
      case '1y': range.setFullYear(now.getFullYear() - 1); break;
      default: range.setDate(now.getDate() - 30); // default 30d
    }
    return range.toISOString();
  }

  private applyBrandFilter(query: any, requestingBrandId: string, queryBrandId?: string, isSuperAdmin: boolean = false) {
    if (isSuperAdmin) {
      if (queryBrandId) query = query.eq('brand_id', queryBrandId);
    } else {
      query = query.eq('brand_id', requestingBrandId);
    }
    return query;
  }

  async getSalesMetrics(requestingBrandId: string, period?: string, brandId?: string, isSuperAdmin: boolean = false) {
    const client = this.supabase.getClient();
    const dateLimit = this.getDateRange(period);

    let leadsQ = client.from('leads').select('*').gte('created_at', dateLimit);
    leadsQ = this.applyBrandFilter(leadsQ, requestingBrandId, brandId, isSuperAdmin);
    const { data: leads, error: leadsErr } = await leadsQ;

    let quotesQ = client.from('quotes').select('*').gte('created_at', dateLimit);
    quotesQ = this.applyBrandFilter(quotesQ, requestingBrandId, brandId, isSuperAdmin);
    const { data: quotes, error: quotesErr } = await quotesQ;

    let ordersQ = client.from('orders').select('*').gte('created_at', dateLimit);
    ordersQ = this.applyBrandFilter(ordersQ, requestingBrandId, brandId, isSuperAdmin);
    const { data: orders, error: ordersErr } = await ordersQ;

    if (leadsErr || quotesErr || ordersErr) throw new InternalServerErrorException('Error fetching metrics');

    const totalLeads = leads.length;
    const leadsToQuotes = totalLeads > 0 ? (quotes.length / totalLeads) * 100 : 0;
    const quotesToOrders = quotes.length > 0 ? (orders.length / quotes.length) * 100 : 0;
    const totalRevenue = orders.reduce((acc, order) => acc + (order.total || 0), 0);

    return { totalLeads, leadsToQuotes, quotesToOrders, totalRevenue };
  }

  async getSalesLeaderboard(requestingBrandId: string, period?: string, brandId?: string, isSuperAdmin: boolean = false) {
    // simplified leaderboard aggregation
    return { leaderboard: [] }; // Mock logic
  }

  async getProductionMetrics(requestingBrandId: string, period?: string, brandId?: string, isSuperAdmin: boolean = false) {
    const client = this.supabase.getClient();
    const dateLimit = this.getDateRange(period);

    let prodQ = client.from('production_jobs').select('status').gte('created_at', dateLimit);
    prodQ = this.applyBrandFilter(prodQ, requestingBrandId, brandId, isSuperAdmin);
    const { data, error } = await prodQ;

    if (error) throw new InternalServerErrorException(error.message);

    const queued = data.filter(d => d.status === 'Queued').length;
    const inProd = data.filter(d => d.status === 'In_Production').length;
    const completed = data.filter(d => d.status === 'Completed').length;

    return { total: data.length, queued, inProd, completed };
  }

  async getQaMetrics(requestingBrandId: string, period?: string, brandId?: string, isSuperAdmin: boolean = false) {
    const client = this.supabase.getClient();
    const dateLimit = this.getDateRange(period);

    let qaQ = client.from('qa_reports').select('status').gte('created_at', dateLimit);
    qaQ = this.applyBrandFilter(qaQ, requestingBrandId, brandId, isSuperAdmin);
    const { data, error } = await qaQ;

    if (error) throw new InternalServerErrorException(error.message);

    const total = data.length;
    const passed = data.filter(d => d.status === QAStatus.Passed).length;
    const failed = data.filter(d => d.status === QAStatus.Failed).length;

    return { total, passed, failed, passRate: total > 0 ? (passed / total) * 100 : 0 };
  }

  async getShippingMetrics(requestingBrandId: string, period?: string, brandId?: string, isSuperAdmin: boolean = false) {
    const client = this.supabase.getClient();
    const dateLimit = this.getDateRange(period);

    let shipQ = client.from('shipments').select('status').gte('created_at', dateLimit);
    shipQ = this.applyBrandFilter(shipQ, requestingBrandId, brandId, isSuperAdmin);
    const { data, error } = await shipQ;

    if (error) throw new InternalServerErrorException(error.message);

    return {
      inTransit: data.filter(d => d.status === ShipmentStatus.In_Transit).length,
      delivered: data.filter(d => d.status === ShipmentStatus.Delivered).length,
      exceptions: data.filter(d => d.status === ShipmentStatus.Exception).length,
    };
  }

  async getRevenueMetrics(requestingBrandId: string, period?: string, brandId?: string, isSuperAdmin: boolean = false) {
    const client = this.supabase.getClient();
    const dateLimit = this.getDateRange(period);

    let orderQ = client.from('orders').select('brand_id, total').gte('created_at', dateLimit);
    orderQ = this.applyBrandFilter(orderQ, requestingBrandId, brandId, isSuperAdmin);
    const { data, error } = await orderQ;

    if (error) throw new InternalServerErrorException(error.message);

    const totalRevenue = data.reduce((sum, o) => sum + (o.total || 0), 0);

    // Group by brand
    const byBrand = data.reduce((acc: Record<string, number>, o) => {
      acc[o.brand_id] = (acc[o.brand_id] || 0) + (o.total || 0);
      return acc;
    }, {});

    return { totalRevenue, byBrand };
  }

  async getOverviewMetrics() {
    // Cross-brand top-line overview (requires CEO/GM)
    const client = this.supabase.getClient();
    const { data: orders } = await client.from('orders').select('total');
    const { count: customersCount } = await client.from('customers').select('*', { count: 'exact', head: true });
    
    const totalRevenue = orders?.reduce((acc, o) => acc + (o.total || 0), 0) || 0;
    
    return {
      totalRevenue,
      customersCount,
      totalOrders: orders?.length || 0
    };
  }
}
