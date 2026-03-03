import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostitController } from './postit.controller';
import { PostitService } from './postit.service';
import { PostIt, PostItSchema } from './schemas/postit.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PostIt.name, schema: PostItSchema }]),
  ],
  controllers: [PostitController],
  providers: [PostitService]
})
export class PostitModule {}
