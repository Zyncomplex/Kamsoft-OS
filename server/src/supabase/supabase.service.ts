import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private clientInstance: SupabaseClient;

  constructor(private readonly configService: ConfigService) {}

  getClient(): SupabaseClient {
    if (this.clientInstance) {
      return this.clientInstance;
    }

    const supabaseUrl = this.configService.get<string>('supabase.url');
    const supabaseKey = this.configService.get<string>('supabase.serviceRoleKey');

    if (!supabaseUrl || !supabaseKey) {
      this.logger.warn('Supabase URL or Service Role Key is missing. Check your environment variables.');
      throw new UnauthorizedException('Missing token');
    }

    this.clientInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    return this.clientInstance;
  }
}
