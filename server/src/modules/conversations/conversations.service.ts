import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { ConversationFilterDto } from './dto/conversation-filter.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ConversationsService {
  constructor(private readonly supabase: SupabaseService) {}

  async create(brandId: string, createDto: CreateConversationDto) {
    const client = this.supabase.getClient();
    
    if (!createDto.lead_id && !createDto.customer_id) {
      throw new BadRequestException('A conversation must be linked to either a lead or a customer.');
    }

    const { data, error } = await client
      .from('conversations')
      .insert([
        {
          ...createDto,
          brand_id: brandId,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }

  async findAll(brandId: string, filterDto: ConversationFilterDto) {
    const client = this.supabase.getClient();
    let query = client
      .from('conversations')
      .select('*, lead:leads(display_id), customer:customers(name)', { count: 'exact' })
      .eq('brand_id', brandId);

    if (filterDto.channel) {
      query = query.eq('channel', filterDto.channel);
    }
    if (filterDto.is_resolved !== undefined) {
      // The query parameter comes as string 'true'/'false' from query string usually,
      // Nest ValidationPipe transform handles it if configured properly, but fallback string check:
      const resolved = filterDto.is_resolved === true || (filterDto.is_resolved as any) === 'true';
      query = query.eq('is_resolved', resolved);
    }
    if (filterDto.lead_id) {
      query = query.eq('lead_id', filterDto.lead_id);
    }

    const page = filterDto.page || 1;
    const limit = filterDto.limit || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to).order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return {
      data,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  }

  async findOne(brandId: string, id: string) {
    const client = this.supabase.getClient();
    
    const { data, error } = await client
      .from('conversations')
      .select(`
        *,
        lead:leads(display_id),
        customer:customers(name),
        messages(*)
      `)
      .eq('id', id)
      .eq('brand_id', brandId)
      .single();

    if (error) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }

    return data;
  }

  async update(brandId: string, id: string, updateDto: UpdateConversationDto) {
    const client = this.supabase.getClient();
    
    const { data, error } = await client
      .from('conversations')
      .update(updateDto)
      .eq('id', id)
      .eq('brand_id', brandId)
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }
    
    if (!data) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }

    return data;
  }

  async addMessage(brandId: string, conversationId: string, senderId: string, createMessageDto: CreateMessageDto) {
    const client = this.supabase.getClient();

    // First ensure conversation belongs to brand
    const { data: conv, error: convError } = await client
      .from('conversations')
      .select('id')
      .eq('id', conversationId)
      .eq('brand_id', brandId)
      .single();

    if (convError || !conv) {
      throw new NotFoundException(`Conversation with ID ${conversationId} not found`);
    }

    const { data, error } = await client
      .from('messages')
      .insert([
        {
          ...createMessageDto,
          conversation_id: conversationId,
          sender_id: senderId,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }

  async getMessages(brandId: string, conversationId: string, page = 1, limit = 50) {
    const client = this.supabase.getClient();

    const { data: conv, error: convError } = await client
      .from('conversations')
      .select('id')
      .eq('id', conversationId)
      .eq('brand_id', brandId)
      .single();

    if (convError || !conv) {
      throw new NotFoundException(`Conversation with ID ${conversationId} not found`);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await client
      .from('messages')
      .select('*', { count: 'exact' })
      .eq('conversation_id', conversationId)
      .range(from, to)
      .order('created_at', { ascending: true });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return {
      data,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  }
}
