import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class BrandFilterInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const brandId = request.brandId;

    if (brandId) {
      // In a real application, you might inject this brandId into a Request-scoped
      // service, or use cls-hooked/AsyncLocalStorage so that all Supabase queries
      // automatically include `.eq('brand_id', brandId)`.
      // For now, we attach it to the request so controllers/services can read it easily.
      // If we are passing the Supabase client directly, we could theoretically modify
      // the client's headers to use the user's JWT instead of service role for true RLS.
    }

    return next.handle();
  }
}
