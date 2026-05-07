import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ActivityLogService } from './activity-log.service';

@Injectable()
export class ActivityLogInterceptor implements NestInterceptor {
  constructor(private readonly activityLogService: ActivityLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, body, user } = req;

    // Only log mutations
    if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
      return next.handle().pipe(
        tap((resData) => {
          // Fire and forget
          this.logAsync(req, resData).catch((err) =>
            console.error('Activity Log Error:', err),
          );
        }),
      );
    }

    return next.handle();
  }

  private async logAsync(req: any, resData: any) {
    const { method, url, user, headers } = req;

    // Extract entity from URL (e.g. /api/leads/123 -> leads)
    const urlParts = url.split('/').filter(Boolean);
    // Ignore global prefix 'api' if present, assume module is 1st or 2nd part
    const entityType = urlParts.includes('api') ? urlParts[1] : urlParts[0];

    const action = `${method}_${entityType}`.toUpperCase();

    // Assume brandId is in header x-brand-id or user.active_brand_id
    const brandId = headers['x-brand-id'] || user?.active_brand_id;
    const userId = user?.id;

    // Entity ID is usually returned in data.id or from URL param
    const entityId =
      resData?.id ||
      (urlParts.length > 1 && urlParts[urlParts.length - 1].length > 10
        ? urlParts[urlParts.length - 1]
        : null);

    if (brandId && userId) {
      await this.activityLogService.logAction(
        brandId,
        userId,
        action,
        entityType,
        entityId,
        { url },
      );
    }
  }
}
