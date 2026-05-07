import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceFilterDto } from './dto/invoice-filter.dto';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { BrandContextGuard } from '../../common/guards/brand-context.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentBrand } from '../../common/decorators/current-brand.decorator';
import { UserRole } from '../../types';

@UseGuards(SupabaseAuthGuard, BrandContextGuard, RolesGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @Roles(UserRole.Manager, UserRole.Admin, UserRole.GM, UserRole.CEO)
  create(
    @CurrentBrand() brandId: string,
    @Body() createDto: CreateInvoiceDto,
  ) {
    return this.invoicesService.create(brandId, createDto);
  }

  @Get('overdue')
  getOverdue(@CurrentBrand() brandId: string) {
    return this.invoicesService.getOverdue(brandId);
  }

  @Get()
  findAll(
    @CurrentBrand() brandId: string,
    @Query() filterDto: InvoiceFilterDto,
  ) {
    return this.invoicesService.findAll(brandId, filterDto);
  }

  @Get(':id')
  findOne(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.invoicesService.findOne(brandId, id);
  }

  @Patch(':id')
  @Roles(UserRole.Manager, UserRole.Admin, UserRole.GM, UserRole.CEO)
  update(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateInvoiceDto,
  ) {
    return this.invoicesService.update(brandId, id, updateDto);
  }

  @Post(':id/mark-paid')
  @Roles(UserRole.Manager, UserRole.Admin, UserRole.GM, UserRole.CEO)
  markPaid(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.invoicesService.markPaid(brandId, id);
  }

  @Post(':id/sync-stripe')
  @Roles(UserRole.Manager, UserRole.Admin, UserRole.GM, UserRole.CEO)
  syncStripe(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.invoicesService.syncStripe(brandId, id);
  }
}
