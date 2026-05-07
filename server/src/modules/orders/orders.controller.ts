import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderFilterDto } from './dto/order-filter.dto';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { BrandContextGuard } from '../../common/guards/brand-context.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentBrand } from '../../common/decorators/current-brand.decorator';
import { UserRole } from '../../types';

@UseGuards(SupabaseAuthGuard, BrandContextGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles(UserRole.Manager, UserRole.Admin, UserRole.GM, UserRole.CEO)
  create(
    @CurrentBrand() brandId: string,
    @Body() createDto: CreateOrderDto,
  ) {
    return this.ordersService.create(brandId, createDto);
  }

  @Get('stats')
  getStats(@CurrentBrand() brandId: string) {
    return this.ordersService.getStats(brandId);
  }

  @Get()
  findAll(
    @CurrentBrand() brandId: string,
    @Query() filterDto: OrderFilterDto,
  ) {
    return this.ordersService.findAll(brandId, filterDto);
  }

  @Get(':id')
  findOne(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.ordersService.findOne(brandId, id);
  }

  @Patch(':id')
  @Roles(UserRole.Manager, UserRole.Admin, UserRole.GM, UserRole.CEO, UserRole.Production, UserRole.QA)
  update(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(brandId, id, updateDto);
  }

  @Post(':id/clone')
  @Roles(UserRole.Manager, UserRole.Admin, UserRole.GM, UserRole.CEO)
  clone(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.ordersService.clone(brandId, id);
  }
}
