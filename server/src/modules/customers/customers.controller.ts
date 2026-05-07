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
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerFilterDto } from './dto/customer-filter.dto';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { BrandContextGuard } from '../../common/guards/brand-context.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentBrand } from '../../common/decorators/current-brand.decorator';
import { UserRole } from '../../types';

@UseGuards(SupabaseAuthGuard, BrandContextGuard, RolesGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @Roles(
    UserRole.SDR,
    UserRole.Manager,
    UserRole.Admin,
    UserRole.GM,
    UserRole.CEO,
  )
  create(
    @CurrentBrand() brandId: string,
    @Body() createCustomerDto: CreateCustomerDto,
  ) {
    return this.customersService.create(brandId, createCustomerDto);
  }

  @Get()
  findAll(
    @CurrentBrand() brandId: string,
    @Query() filterDto: CustomerFilterDto,
  ) {
    return this.customersService.findAll(brandId, filterDto);
  }

  @Get(':id')
  findOne(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.customersService.findOne(brandId, id);
  }

  @Patch(':id')
  @Roles(
    UserRole.SDR,
    UserRole.Manager,
    UserRole.Admin,
    UserRole.GM,
    UserRole.CEO,
  )
  update(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(brandId, id, updateCustomerDto);
  }

  @Post(':id/merge')
  @Roles(UserRole.Manager, UserRole.Admin, UserRole.GM, UserRole.CEO)
  merge(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) targetId: string,
    @Body('sourceId', ParseUUIDPipe) sourceId: string,
  ) {
    return this.customersService.merge(brandId, targetId, sourceId);
  }
}
