import { Test, TestingModule } from '@nestjs/testing';
import { QaReportsService } from './qa-reports.service';

describe('QaReportsService', () => {
  let service: QaReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QaReportsService],
    }).compile();

    service = module.get<QaReportsService>(QaReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
