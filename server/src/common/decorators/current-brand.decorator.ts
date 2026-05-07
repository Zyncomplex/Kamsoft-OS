import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentBrand = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.brandId;
  },
);
