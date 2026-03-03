import { Test, TestingModule } from '@nestjs/testing';
import { PostitController } from './postit.controller';

describe('PostitController', () => {
  let controller: PostitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostitController],
    }).compile();

    controller = module.get<PostitController>(PostitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
