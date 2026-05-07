import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto, QuoteItemDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { QuoteFilterDto } from './dto/quote-filter.dto';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { BrandContextGuard } from '../../common/guards/brand-context.guard';
import { CurrentBrand } from '../../common/decorators/current-brand.decorator';
import { QuoteStatus } from '../../types';

@UseGuards(SupabaseAuthGuard, BrandContextGuard)
@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post()
  create(
    @CurrentBrand() brandId: string,
    @Body() createDto: CreateQuoteDto,
  ) {
    return this.quotesService.create(brandId, createDto);
  }

  @Post('calculate')
  calculate(
    @Body('items') items: QuoteItemDto[]
  ) {
    const warnings = this.quotesService.validateQuoteItems(items);
    const totals = this.quotesService.calculateTotals(items);
    return { ...totals, warnings };
  }

  @Get()
  findAll(
    @CurrentBrand() brandId: string,
    @Query() filterDto: QuoteFilterDto,
  ) {
    return this.quotesService.findAll(brandId, filterDto);
  }

  @Get(':id')
  findOne(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.quotesService.findOne(brandId, id);
  }

  @Patch(':id')
  update(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateQuoteDto,
  ) {
    return this.quotesService.update(brandId, id, updateDto);
  }

  @Post(':id/send')
  send(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.quotesService.updateStatus(brandId, id, QuoteStatus.Sent);
  }

  @Post(':id/accept')
  accept(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.quotesService.accept(brandId, id);
  }

  @Post(':id/reject')
  reject(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason: string,
  ) {
    return this.quotesService.reject(brandId, id, reason);
  }

  @Post(':id/clone')
  clone(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.quotesService.clone(brandId, id);
  }
}
