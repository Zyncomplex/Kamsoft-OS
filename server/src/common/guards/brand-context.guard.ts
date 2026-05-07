import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class BrandContextGuard implements CanActivate {
  constructor(private readonly supabase: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // The user object is attached to the request by SupabaseAuthGuard
    // It contains the decoded JWT. The user ID is in the 'sub' field.
    const userId = user?.sub || user?.id;

    if (!userId) {
      throw new BadRequestException(
        'User identification missing from session.',
      );
    }

    const client = this.supabase.getClient();

    // Fetch the latest profile data from the database to get the real active_brand_id
    const { data: profile, error } = await client
      .from('profiles')
      .select('active_brand_id, is_active, role, brand_ids')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      throw new BadRequestException('User profile not found.');
    }

    if (!profile.is_active) {
      throw new ForbiddenException(
        'Your account is deactivated. Please contact an administrator.',
      );
    }

    if (!profile.active_brand_id) {
      throw new BadRequestException(
        'Active brand context is missing. Please select a brand in your profile.',
      );
    }

    // Attach brand info and full profile data to the request for downstream use
    request.brandId = profile.active_brand_id;
    request.userProfile = profile;

    return true;
  }
}
