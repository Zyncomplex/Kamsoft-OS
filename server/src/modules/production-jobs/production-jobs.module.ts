import { Module } from '@nestjs/common';
import { ProductionJobsController } from './production-jobs.controller';
import { ProductionJobsService } from './production-jobs.service';

@Module({
  controllers: [ProductionJobsController],
  providers: [ProductionJobsService],
})
export class ProductionJobsModule {}
