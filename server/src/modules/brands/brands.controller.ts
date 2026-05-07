import { Controller, Get, Post, Body, Patch, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../types';

@UseGuards(SupabaseAuthGuard, RolesGuard)
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @Roles(UserRole.Admin)
  create(@Body() createDto: CreateBrandDto) {
    return this.brandsService.create(createDto);
  }

  @Get()
  @Roles(UserRole.Admin, UserRole.CEO, UserRole.GM, UserRole.Manager)
  findAll() {
    return this.brandsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.Admin, UserRole.CEO, UserRole.GM, UserRole.Manager)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.brandsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.Admin)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateBrandDto,
  ) {
    return this.brandsService.update(id, updateDto);
  }
}
