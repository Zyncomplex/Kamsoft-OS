import { Module } from '@nestjs/common';
import { DesignTasksController } from './design-tasks.controller';
import { DesignTasksService } from './design-tasks.service';

@Module({
  controllers: [DesignTasksController],
  providers: [DesignTasksService],
})
export class DesignTasksModule {}
