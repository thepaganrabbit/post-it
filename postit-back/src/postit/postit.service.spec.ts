import { Test, TestingModule } from '@nestjs/testing';
import { PostitService } from './postit.service';

describe('PostitService', () => {
  let service: PostitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostitService],
    }).compile();

    service = module.get<PostitService>(PostitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
