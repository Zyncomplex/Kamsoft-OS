import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { BrandContextGuard } from '../../common/guards/brand-context.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../types';

@Controller('vendors')
@UseGuards(SupabaseAuthGuard, BrandContextGuard, RolesGuard)
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post()
  @Roles(UserRole.Admin, UserRole.Manager)
  create(@Request() req: any, @Body() createVendorDto: CreateVendorDto) {
    return this.vendorsService.create(req.brandId, createVendorDto);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.vendorsService.findAll(req.brandId);
  }

  @Get('rankings')
  getRankings(@Request() req: any) {
    return this.vendorsService.getRankings(req.brandId);
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.vendorsService.findOne(req.brandId, id);
  }

  @Patch(':id')
  @Roles(UserRole.Admin, UserRole.Manager)
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateVendorDto: UpdateVendorDto,
  ) {
    return this.vendorsService.update(req.brandId, id, updateVendorDto);
  }
}
