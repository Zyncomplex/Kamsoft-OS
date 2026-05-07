import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { ConfigureIntegrationDto } from './dto/configure-integration.dto';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { BrandContextGuard } from '../../common/guards/brand-context.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentBrand } from '../../common/decorators/current-brand.decorator';
import { UserRole } from '../../types';

@UseGuards(SupabaseAuthGuard, BrandContextGuard, RolesGuard)
@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Get()
  @Roles(UserRole.Admin, UserRole.CEO, UserRole.GM, UserRole.Manager)
  findAll(@CurrentBrand() brandId: string) {
    return this.integrationsService.findAll(brandId);
  }

  @Get(':type')
  @Roles(UserRole.Admin, UserRole.CEO, UserRole.GM, UserRole.Manager)
  findOne(
    @CurrentBrand() brandId: string,
    @Param('type') type: string,
  ) {
    return this.integrationsService.findOne(brandId, type);
  }

  @Post(':type/configure')
  @Roles(UserRole.Admin)
  configure(
    @CurrentBrand() brandId: string,
    @Param('type') type: string,
    @Body() dto: ConfigureIntegrationDto,
  ) {
    return this.integrationsService.configure(brandId, type, dto);
  }

  @Post(':type/test')
  @Roles(UserRole.Admin, UserRole.CEO, UserRole.GM)
  testConnection(
    @CurrentBrand() brandId: string,
    @Param('type') type: string,
  ) {
    return this.integrationsService.testConnection(brandId, type);
  }

  @Post(':type/enable')
  @Roles(UserRole.Admin)
  enable(
    @CurrentBrand() brandId: string,
    @Param('type') type: string,
  ) {
    return this.integrationsService.enable(brandId, type);
  }

  @Post(':type/disable')
  @Roles(UserRole.Admin)
  disable(
    @CurrentBrand() brandId: string,
    @Param('type') type: string,
  ) {
    return this.integrationsService.disable(brandId, type);
  }
}
