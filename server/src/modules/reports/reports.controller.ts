import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentBrand } from '../../common/decorators/current-brand.decorator';
import { UserRole } from '../../types';

@UseGuards(SupabaseAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  private isSuperAdmin(req: any) {
    const role = req.user?.role;
    return (
      role === UserRole.CEO || role === UserRole.GM || role === UserRole.Admin
    );
  }

  @Get('sales')
  @Roles(
    UserRole.Manager,
    UserRole.GM,
    UserRole.CEO,
    UserRole.Admin,
    UserRole.SDR,
  )
  getSalesMetrics(
    @CurrentBrand() currentBrandId: string,
    @Query('period') period: string,
    @Query('brand_id') brandId: string,
    @Req() req: any,
  ) {
    return this.reportsService.getSalesMetrics(
      currentBrandId,
      period,
      brandId,
      this.isSuperAdmin(req),
    );
  }

  @Get('sales/leaderboard')
  @Roles(
    UserRole.Manager,
    UserRole.GM,
    UserRole.CEO,
    UserRole.Admin,
    UserRole.SDR,
  )
  getSalesLeaderboard(
    @CurrentBrand() currentBrandId: string,
    @Query('period') period: string,
    @Query('brand_id') brandId: string,
    @Req() req: any,
  ) {
    return this.reportsService.getSalesLeaderboard(
      currentBrandId,
      period,
      brandId,
      this.isSuperAdmin(req),
    );
  }

  @Get('production')
  @Roles(
    UserRole.Manager,
    UserRole.GM,
    UserRole.CEO,
    UserRole.Admin,
    UserRole.Production,
  )
  getProductionMetrics(
    @CurrentBrand() currentBrandId: string,
    @Query('period') period: string,
    @Query('brand_id') brandId: string,
    @Req() req: any,
  ) {
    return this.reportsService.getProductionMetrics(
      currentBrandId,
      period,
      brandId,
      this.isSuperAdmin(req),
    );
  }

  @Get('qa')
  @Roles(
    UserRole.Manager,
    UserRole.GM,
    UserRole.CEO,
    UserRole.Admin,
    UserRole.QA,
  )
  getQaMetrics(
    @CurrentBrand() currentBrandId: string,
    @Query('period') period: string,
    @Query('brand_id') brandId: string,
    @Req() req: any,
  ) {
    return this.reportsService.getQaMetrics(
      currentBrandId,
      period,
      brandId,
      this.isSuperAdmin(req),
    );
  }

  @Get('shipping')
  @Roles(
    UserRole.Manager,
    UserRole.GM,
    UserRole.CEO,
    UserRole.Admin,
    UserRole.QA,
  )
  getShippingMetrics(
    @CurrentBrand() currentBrandId: string,
    @Query('period') period: string,
    @Query('brand_id') brandId: string,
    @Req() req: any,
  ) {
    return this.reportsService.getShippingMetrics(
      currentBrandId,
      period,
      brandId,
      this.isSuperAdmin(req),
    );
  }

  @Get('revenue')
  @Roles(UserRole.GM, UserRole.CEO, UserRole.Admin)
  getRevenueMetrics(
    @CurrentBrand() currentBrandId: string,
    @Query('period') period: string,
    @Query('brand_id') brandId: string,
    @Req() req: any,
  ) {
    return this.reportsService.getRevenueMetrics(
      currentBrandId,
      period,
      brandId,
      this.isSuperAdmin(req),
    );
  }

  @Get('overview')
  @Roles(UserRole.GM, UserRole.CEO, UserRole.Admin)
  getOverviewMetrics(
    @CurrentBrand() currentBrandId: string,
    @Query('period') period: string,
    @Query('brand_id') brandId: string,
    @Req() req: any,
  ) {
    return this.reportsService.getOverviewMetrics(
      currentBrandId,
      period,
      brandId,
      this.isSuperAdmin(req),
    );
  }
}
