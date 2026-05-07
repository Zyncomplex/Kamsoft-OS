import { Test, TestingModule } from '@nestjs/testing';
import { DesignTasksController } from './design-tasks.controller';

describe('DesignTasksController', () => {
  let controller: DesignTasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DesignTasksController],
    }).compile();

    controller = module.get<DesignTasksController>(DesignTasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
