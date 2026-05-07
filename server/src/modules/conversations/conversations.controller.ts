import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { ConversationFilterDto } from './dto/conversation-filter.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { BrandContextGuard } from '../../common/guards/brand-context.guard';
import { CurrentBrand } from '../../common/decorators/current-brand.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@UseGuards(SupabaseAuthGuard, BrandContextGuard)
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  create(
    @CurrentBrand() brandId: string,
    @Body() createDto: CreateConversationDto,
  ) {
    return this.conversationsService.create(brandId, createDto);
  }

  @Get()
  findAll(
    @CurrentBrand() brandId: string,
    @Query() filterDto: ConversationFilterDto,
  ) {
    return this.conversationsService.findAll(brandId, filterDto);
  }

  @Get(':id')
  findOne(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.conversationsService.findOne(brandId, id);
  }

  @Patch(':id')
  update(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateConversationDto,
  ) {
    return this.conversationsService.update(brandId, id, updateDto);
  }

  @Post(':id/messages')
  addMessage(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.conversationsService.addMessage(brandId, id, user.id, createMessageDto);
  }

  @Get(':id/messages')
  getMessages(
    @CurrentBrand() brandId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.conversationsService.getMessages(brandId, id, page, limit);
  }
}
