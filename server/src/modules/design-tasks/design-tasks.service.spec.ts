import { Test, TestingModule } from '@nestjs/testing';
import { DesignTasksService } from './design-tasks.service';

describe('DesignTasksService', () => {
  let service: DesignTasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DesignTasksService],
    }).compile();

    service = module.get<DesignTasksService>(DesignTasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
