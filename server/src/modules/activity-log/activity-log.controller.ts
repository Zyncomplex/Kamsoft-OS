import { Controller, Get, Param, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ActivityLogService } from './activity-log.service';
import { ActivityLogFilterDto } from './dto/activity-log-filter.dto';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { BrandContextGuard } from '../../common/guards/brand-context.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentBrand } from '../../common/decorators/current-brand.decorator';

@UseGuards(SupabaseAuthGuard, BrandContextGuard, RolesGuard)
@Controller('activity-log')
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Get()
  findAll(
    @CurrentBrand() brandId: string,
    @Query() filterDto: ActivityLogFilterDto,
  ) {
    return this.activityLogService.findAll(brandId, filterDto);
  }

  @Get('user/:userId')
  findByUser(
    @CurrentBrand() brandId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() filterDto: ActivityLogFilterDto,
  ) {
    return this.activityLogService.findByUser(brandId, userId, filterDto);
  }

  @Get('entity/:type/:id')
  findByEntity(
    @CurrentBrand() brandId: string,
    @Param('type') type: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Query() filterDto: ActivityLogFilterDto,
  ) {
    return this.activityLogService.findByEntity(brandId, type, id, filterDto);
  }
}
