import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { IntegrationsService } from '../integrations/integrations.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { ShipmentFilterDto } from './dto/shipment-filter.dto';
import { ShipmentStatus, OrderStatus } from '../../types';

@Injectable()
export class ShipmentsService {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly integrations: IntegrationsService,
  ) {}

  async create(brandId: string, createDto: CreateShipmentDto) {
    const client = this.supabase.getClient();
    
    const initialHistory = [{
      status: ShipmentStatus.Label_Created,
      timestamp: new Date().toISOString(),
      location: 'Warehouse'
    }];

    const { data, error } = await client
      .from('shipments')
      .insert([
        {
          ...createDto,
          brand_id: brandId,
          status: ShipmentStatus.Label_Created,
          status_history: initialHistory,
        },
      ])
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async findAll(brandId: string, filterDto: ShipmentFilterDto) {
    const client = this.supabase.getClient();
    let query = client
      .from('shipments')
      .select('*, order:orders(display_id)', { count: 'exact' })
      .eq('brand_id', brandId);

    if (filterDto.status) query = query.eq('status', filterDto.status);
    if (filterDto.carrier) query = query.ilike('carrier', `%${filterDto.carrier}%`);
    if (filterDto.order_id) query = query.eq('order_id', filterDto.order_id);

    const page = filterDto.page || 1;
    const limit = filterDto.limit || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to).order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) throw new InternalServerErrorException(error.message);

    return {
      data,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  }

  async findOne(brandId: string, id: string) {
    const client = this.supabase.getClient();
    
    const { data, error } = await client
      .from('shipments')
      .select(`
        *,
        order:orders(*)
      `)
      .eq('id', id)
      .eq('brand_id', brandId)
      .single();

    if (error) throw new NotFoundException(`Shipment with ID ${id} not found`);
    return data;
  }

  async update(brandId: string, id: string, updateDto: UpdateShipmentDto) {
    const client = this.supabase.getClient();
    const shipment = await this.findOne(brandId, id);

    let newHistory = shipment.status_history || [];
    
    if (updateDto.status && updateDto.status !== shipment.status) {
      newHistory = [
        ...newHistory,
        {
          status: updateDto.status,
          timestamp: new Date().toISOString(),
          location: updateDto.location || null,
        }
      ];
    }

    const { data, error } = await client
      .from('shipments')
      .update({
        ...updateDto,
        status_history: newHistory,
      })
      .eq('id', id)
      .eq('brand_id', brandId)
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);

    // If delivered, update order status
    if (updateDto.status === ShipmentStatus.Delivered) {
      await client
        .from('orders')
        .update({ status: OrderStatus.Delivered })
        .eq('id', shipment.order_id)
        .eq('brand_id', brandId);
    }

    return data;
  }

  async createLabel(brandId: string, id: string) {
    const shipment = await this.findOne(brandId, id);
    const adapter = await this.integrations.getConnectedAdapter(brandId, shipment.carrier.toLowerCase());
    
    if (!adapter) {
      return { success: false, message: 'Adapter not configured for ' + shipment.carrier };
    }

    // Since these are stubbed in Phase 4:
    return await (adapter as any).createLabel();
  }

  async refreshTracking(brandId: string, id: string) {
    const shipment = await this.findOne(brandId, id);
    const adapter = await this.integrations.getConnectedAdapter(brandId, shipment.carrier.toLowerCase());
    
    if (!adapter) {
      return { success: false, message: 'Adapter not configured for ' + shipment.carrier };
    }

    // Since these are stubbed in Phase 4:
    return await (adapter as any).getTracking();
  }

  async getDashboard(brandId: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('shipments')
      .select('status')
      .eq('brand_id', brandId);

    if (error) throw new InternalServerErrorException(error.message);

    return {
      inTransit: data.filter(s => s.status === ShipmentStatus.In_Transit).length,
      delivered: data.filter(s => s.status === ShipmentStatus.Delivered).length,
      exceptions: data.filter(s => s.status === ShipmentStatus.Exception).length,
    };
  }
}
