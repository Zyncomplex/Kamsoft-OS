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
  ParseIntPipe,
} from '@nestjs/common';
import { DesignTasksService } from './design-tasks.service';
import { CreateDesignTaskDto } from './dto/create-design-task.dto';
import { UpdateDesignTaskDto } from './dto/update-design-task.dto';
import { DesignTaskFilterDto } from './dto/design-task-filter.dto';
import { UploadVersionDto } from './dto/upload-version.dto';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { BrandContextGuard } from '../../common/guards/brand-context.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentBrand } from '../../common/decorators/current-brand.decorator';
import { UserRole } from '../../types';

@UseGuards(SupabaseAuthGuard, BrandContextGuard, RolesGuard)
@Controller('design-tasks')
export class DesignTasksController {
  constructor(private readonly designTasksService: DesignTasksService) {}

  @Post()
  @Roles(
    UserRole.Manager,
    UserRole.Admin,
    UserRole.GM,
    UserRole.CEO,
    UserRole.SDR,
  )
  create(
    @CurrentBrand() brandId: string,
    @Body() createDto: CreateDesignTaskDto,
  ) {
    return this.designTasksService.create(brandId, createDto);
  }

  @Get()
  findAll(
    @CurrentBrand() brandId: string,
    @Query() filterDto: DesignTaskFilterDto,
  ) {
    return this.designTasksService.findAll(brandId, filterDto);
  }

  @Get(':id')
  findOne(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.designTasksService.findOne(brandId, id);
  }

  @Patch(':id')
  @Roles(
    UserRole.Manager,
    UserRole.Admin,
    UserRole.GM,
    UserRole.CEO,
    UserRole.Designer,
  )
  update(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateDesignTaskDto,
  ) {
    return this.designTasksService.update(brandId, id, updateDto);
  }

  @Post(':id/versions')
  @Roles(
    UserRole.Designer,
    UserRole.Manager,
    UserRole.Admin,
    UserRole.GM,
    UserRole.CEO,
  )
  uploadVersion(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() versionDto: UploadVersionDto,
  ) {
    return this.designTasksService.uploadVersion(brandId, id, versionDto);
  }

  @Get(':id/versions')
  getVersions(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.designTasksService.getVersions(brandId, id);
  }

  @Get(':id/versions/:version')
  getVersion(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('version', ParseIntPipe) versionNum: number,
  ) {
    return this.designTasksService.getVersion(brandId, id, versionNum);
  }

  @Post(':id/submit')
  @Roles(
    UserRole.Designer,
    UserRole.Manager,
    UserRole.Admin,
    UserRole.GM,
    UserRole.CEO,
    UserRole.SDR,
  )
  submitForApproval(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.designTasksService.submitForApproval(brandId, id);
  }

  @Post(':id/approve')
  @Roles(
    UserRole.Manager,
    UserRole.Admin,
    UserRole.GM,
    UserRole.CEO,
    UserRole.SDR,
  )
  approve(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.designTasksService.approve(brandId, id);
  }

  @Post(':id/request-revision')
  @Roles(
    UserRole.Manager,
    UserRole.Admin,
    UserRole.GM,
    UserRole.CEO,
    UserRole.SDR,
  )
  requestRevision(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body('feedback') feedback: string,
  ) {
    return this.designTasksService.requestRevision(brandId, id, feedback);
  }
}
