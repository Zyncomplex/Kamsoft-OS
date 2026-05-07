import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ProductionJobsService } from './production-jobs.service';
import { CreateProductionJobDto } from './dto/create-production-job.dto';
import { UpdateProductionJobDto } from './dto/update-production-job.dto';
import { ProductionJobFilterDto } from './dto/production-job-filter.dto';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { BrandContextGuard } from '../../common/guards/brand-context.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentBrand } from '../../common/decorators/current-brand.decorator';
import { UserRole } from '../../types';

@UseGuards(SupabaseAuthGuard, BrandContextGuard, RolesGuard)
@Controller('production-jobs')
export class ProductionJobsController {
  constructor(private readonly productionJobsService: ProductionJobsService) {}

  @Post()
  @Roles(UserRole.Manager, UserRole.Admin, UserRole.GM, UserRole.CEO, UserRole.Production)
  create(
    @CurrentBrand() brandId: string,
    @Body() createDto: CreateProductionJobDto,
  ) {
    return this.productionJobsService.create(brandId, createDto);
  }

  @Get('board')
  getBoard(@CurrentBrand() brandId: string) {
    return this.productionJobsService.getBoard(brandId);
  }

  @Get()
  findAll(
    @CurrentBrand() brandId: string,
    @Query() filterDto: ProductionJobFilterDto,
  ) {
    return this.productionJobsService.findAll(brandId, filterDto);
  }

  @Get(':id')
  findOne(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.productionJobsService.findOne(brandId, id);
  }

  @Patch(':id')
  @Roles(UserRole.Manager, UserRole.Admin, UserRole.GM, UserRole.CEO, UserRole.Production)
  update(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateProductionJobDto,
  ) {
    return this.productionJobsService.update(brandId, id, updateDto);
  }
}
