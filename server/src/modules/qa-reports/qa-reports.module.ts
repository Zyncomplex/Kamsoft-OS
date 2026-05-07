import { Module } from '@nestjs/common';
import { QaReportsController } from './qa-reports.controller';
import { QaReportsService } from './qa-reports.service';

@Module({
  controllers: [QaReportsController],
  providers: [QaReportsService]
})
export class QaReportsModule {}
