import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';

@Injectable()
export class BrandContextGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    // We assume the active_brand_id is stored in the JWT user_metadata during login/brand switch
    // Or it might be fetched in a middleware prior to this.
    // For now, let's look for it in user.user_metadata or a custom claim
    const activeBrandId = user?.user_metadata?.active_brand_id || user?.active_brand_id;

    if (!activeBrandId) {
      throw new BadRequestException('Active brand context is missing. Please select a brand.');
    }

    request.brandId = activeBrandId;
    return true;
  }
}
