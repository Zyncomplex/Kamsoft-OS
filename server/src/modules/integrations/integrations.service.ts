import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { IntegrationAdapterFactory } from './integrations.factory';
import { ConfigureIntegrationDto } from './dto/configure-integration.dto';
import { BaseAdapter } from './adapters/base.adapter';

@Injectable()
export class IntegrationsService {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly factory: IntegrationAdapterFactory,
  ) {}

  async findAll(brandId: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('integrations')
      .select('*')
      .eq('brand_id', brandId);

    if (error) throw new InternalServerErrorException(error.message);

    // Return the ones in DB + missing ones as disabled
    const supported = this.factory.getAllSupportedTypes();
    const result = supported.map((type) => {
      const existing = data.find((d) => d.type === type);
      if (existing) return existing;
      return { brand_id: brandId, type, is_enabled: false, config: {} };
    });

    return result;
  }

  async findOne(brandId: string, type: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('integrations')
      .select('*')
      .eq('brand_id', brandId)
      .eq('type', type)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new InternalServerErrorException(error.message);
    }

    if (!data) {
      return { brand_id: brandId, type, is_enabled: false, config: {} };
    }
    return data;
  }

  async configure(brandId: string, type: string, dto: ConfigureIntegrationDto) {
    const client = this.supabase.getClient();

    // Validate adapter type
    this.factory.getAdapter(type);

    const { data, error } = await client
      .from('integrations')
      .upsert(
        {
          brand_id: brandId,
          type,
          config: dto.config,
        },
        { onConflict: 'brand_id, type' },
      )
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async enable(brandId: string, type: string) {
    const client = this.supabase.getClient();
    const integration = await this.findOne(brandId, type);

    if (Object.keys(integration.config || {}).length === 0) {
      throw new BadRequestException(
        'Cannot enable integration without configuration.',
      );
    }

    const { data, error } = await client
      .from('integrations')
      .upsert(
        { brand_id: brandId, type, is_enabled: true },
        { onConflict: 'brand_id, type' },
      )
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async disable(brandId: string, type: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('integrations')
      .upsert(
        { brand_id: brandId, type, is_enabled: false },
        { onConflict: 'brand_id, type' },
      )
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async testConnection(brandId: string, type: string) {
    const integration = await this.findOne(brandId, type);
    const adapter = this.factory.getAdapter(type);

    await adapter.connect(integration.config || {});
    const result = await adapter.testConnection();
    await adapter.disconnect();

    return result;
  }

  // Get a connected adapter for use by other modules
  async getConnectedAdapter(
    brandId: string,
    type: string,
  ): Promise<BaseAdapter | null> {
    const integration = await this.findOne(brandId, type);
    if (!integration.is_enabled) return null;

    const adapter = this.factory.getAdapter(type);
    await adapter.connect(integration.config || {});
    return adapter;
  }
}
