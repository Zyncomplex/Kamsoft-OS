import { Test, TestingModule } from '@nestjs/testing';
import { QaReportsController } from './qa-reports.controller';

describe('QaReportsController', () => {
  let controller: QaReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QaReportsController],
    }).compile();

    controller = module.get<QaReportsController>(QaReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
