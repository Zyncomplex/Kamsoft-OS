import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { ShipmentFilterDto } from './dto/shipment-filter.dto';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { BrandContextGuard } from '../../common/guards/brand-context.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentBrand } from '../../common/decorators/current-brand.decorator';
import { UserRole } from '../../types';

@UseGuards(SupabaseAuthGuard, BrandContextGuard, RolesGuard)
@Controller('shipments')
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @Post()
  @Roles(UserRole.Manager, UserRole.Admin, UserRole.GM, UserRole.CEO, UserRole.QA)
  create(
    @CurrentBrand() brandId: string,
    @Body() createDto: CreateShipmentDto,
  ) {
    return this.shipmentsService.create(brandId, createDto);
  }

  @Get('dashboard')
  @Roles(UserRole.Manager, UserRole.Admin, UserRole.GM, UserRole.CEO, UserRole.QA, UserRole.SDR)
  getDashboard(@CurrentBrand() brandId: string) {
    return this.shipmentsService.getDashboard(brandId);
  }

  @Get()
  findAll(
    @CurrentBrand() brandId: string,
    @Query() filterDto: ShipmentFilterDto,
  ) {
    return this.shipmentsService.findAll(brandId, filterDto);
  }

  @Get(':id')
  findOne(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.shipmentsService.findOne(brandId, id);
  }

  @Patch(':id')
  @Roles(UserRole.Manager, UserRole.Admin, UserRole.GM, UserRole.CEO, UserRole.QA)
  update(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateShipmentDto,
  ) {
    return this.shipmentsService.update(brandId, id, updateDto);
  }

  @Post(':id/create-label')
  @Roles(UserRole.Manager, UserRole.Admin, UserRole.GM, UserRole.CEO, UserRole.QA)
  createLabel(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.shipmentsService.createLabel(brandId, id);
  }

  @Post(':id/refresh-tracking')
  refreshTracking(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.shipmentsService.refreshTracking(brandId, id);
  }
}
