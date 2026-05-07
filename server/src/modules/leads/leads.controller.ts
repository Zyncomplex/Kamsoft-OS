import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadFilterDto } from './dto/lead-filter.dto';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { BrandContextGuard } from '../../common/guards/brand-context.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentBrand } from '../../common/decorators/current-brand.decorator';
import { UserRole } from '../../types';

@UseGuards(SupabaseAuthGuard, BrandContextGuard, RolesGuard)
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @Roles(UserRole.SDR, UserRole.Manager, UserRole.Admin, UserRole.GM, UserRole.CEO)
  create(
    @CurrentBrand() brandId: string,
    @Body() createLeadDto: CreateLeadDto,
  ) {
    return this.leadsService.create(brandId, createLeadDto);
  }

  @Get('overdue')
  getOverdue(@CurrentBrand() brandId: string) {
    return this.leadsService.getOverdue(brandId);
  }

  @Get('next-available-sdr')
  getNextAvailableSdr(@CurrentBrand() brandId: string) {
    return this.leadsService.getNextAvailableSdr(brandId);
  }

  @Get()
  findAll(
    @CurrentBrand() brandId: string,
    @Query() filterDto: LeadFilterDto,
  ) {
    return this.leadsService.findAll(brandId, filterDto);
  }

  @Get(':id')
  findOne(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.leadsService.findOne(brandId, id);
  }

  @Patch(':id')
  @Roles(UserRole.SDR, UserRole.Manager, UserRole.Admin, UserRole.GM, UserRole.CEO)
  update(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLeadDto: UpdateLeadDto,
  ) {
    return this.leadsService.update(brandId, id, updateLeadDto);
  }

  @Post(':id/assign')
  @Roles(UserRole.Manager, UserRole.Admin, UserRole.GM, UserRole.CEO)
  assign(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body('sdrId', ParseUUIDPipe) sdrId: string,
  ) {
    return this.leadsService.assign(brandId, id, sdrId);
  }

  @Post(':id/reassign')
  @Roles(UserRole.Manager, UserRole.Admin, UserRole.GM, UserRole.CEO)
  reassign(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body('sdrId', ParseUUIDPipe) sdrId: string,
    @Body('reason') reason: string,
  ) {
    // In future, log the reassignment reason to activity_log
    return this.leadsService.assign(brandId, id, sdrId);
  }

  @Post(':id/convert')
  @Roles(UserRole.SDR, UserRole.Manager, UserRole.Admin, UserRole.GM, UserRole.CEO)
  convert(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.leadsService.convertToQuote(brandId, id);
  }
}
