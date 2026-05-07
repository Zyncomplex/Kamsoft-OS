import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { QaReportsService } from './qa-reports.service';
import { CreateQaReportDto } from './dto/create-qa-report.dto';
import { UpdateQaReportDto } from './dto/update-qa-report.dto';
import { QaReportFilterDto } from './dto/qa-report-filter.dto';
import { UploadPhotoDto } from './dto/upload-photo.dto';
import { UpdateChecklistDto } from './dto/update-checklist.dto';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { BrandContextGuard } from '../../common/guards/brand-context.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentBrand } from '../../common/decorators/current-brand.decorator';
import { UserRole } from '../../types';

@UseGuards(SupabaseAuthGuard, BrandContextGuard, RolesGuard)
@Controller('qa-reports')
export class QaReportsController {
  constructor(private readonly qaReportsService: QaReportsService) {}

  @Post()
  @Roles(
    UserRole.Manager,
    UserRole.Admin,
    UserRole.GM,
    UserRole.CEO,
    UserRole.QA,
  )
  create(
    @CurrentBrand() brandId: string,
    @Body() createDto: CreateQaReportDto,
  ) {
    return this.qaReportsService.create(brandId, createDto);
  }

  @Get('stats')
  @Roles(
    UserRole.Manager,
    UserRole.Admin,
    UserRole.GM,
    UserRole.CEO,
    UserRole.QA,
  )
  getStats(@CurrentBrand() brandId: string) {
    return this.qaReportsService.getStats(brandId);
  }

  @Get()
  findAll(
    @CurrentBrand() brandId: string,
    @Query() filterDto: QaReportFilterDto,
  ) {
    return this.qaReportsService.findAll(brandId, filterDto);
  }

  @Get(':id')
  findOne(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.qaReportsService.findOne(brandId, id);
  }

  @Patch(':id')
  @Roles(
    UserRole.Manager,
    UserRole.Admin,
    UserRole.GM,
    UserRole.CEO,
    UserRole.QA,
  )
  update(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateQaReportDto,
  ) {
    return this.qaReportsService.update(brandId, id, updateDto);
  }

  @Patch(':id/checklist')
  @Roles(
    UserRole.Manager,
    UserRole.Admin,
    UserRole.GM,
    UserRole.CEO,
    UserRole.QA,
  )
  updateChecklist(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateChecklistDto,
  ) {
    return this.qaReportsService.updateChecklist(brandId, id, updateDto);
  }

  @Post(':id/photos')
  @Roles(
    UserRole.Manager,
    UserRole.Admin,
    UserRole.GM,
    UserRole.CEO,
    UserRole.QA,
  )
  uploadPhoto(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() photoDto: UploadPhotoDto,
  ) {
    return this.qaReportsService.uploadPhoto(brandId, id, photoDto);
  }

  @Post(':id/submit')
  @Roles(
    UserRole.Manager,
    UserRole.Admin,
    UserRole.GM,
    UserRole.CEO,
    UserRole.QA,
  )
  submit(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.qaReportsService.submit(brandId, id);
  }
}
