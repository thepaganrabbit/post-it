import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostIt, PostItDocument } from './schemas/postit.schema';
import { CreatePostItDto } from './dto/create-postit.dto';
import { UpdatePostItDto } from './dto/update-postit.dto';
import { PostitCounts, ResponsePayload } from 'src/types';
import { extractUniqueStrings } from 'src/utils';

@Injectable()
export class PostitService {
  constructor(
    @InjectModel(PostIt.name) private postItModel: Model<PostItDocument>,
  ) {}

  async create(createPostItDto: CreatePostItDto): Promise<PostIt> {
    const createdPostIt = new this.postItModel(createPostItDto);
    return createdPostIt.save();
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    sort = 'priority',
  ): Promise<{
    payload: ResponsePayload;
    total: number;
    page: number;
    totalPages: number;
    tags: Array<string>,
    docCounts: PostitCounts;
  }> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.postItModel
        .find({ completed: false })
        .skip(skip)
        .limit(limit)
        .exec(),

      this.postItModel.countDocuments({ completed: false }).exec(),
    ]);

    const totals = {
      total: 0,
      todos: 0,
      completed: 0,
      inProgress: 0,
    };

    const postits = await this.postItModel.find({});
    const tagsFromDb = postits.map((postit) => postit.tags);
    const tags = extractUniqueStrings(tagsFromDb);
    if (postits) { 
      totals.total = postits.length;
      totals.todos = postits.filter((todo) => !todo.inProgress && !todo.completed).length;
      totals.inProgress = postits.filter((todo) => todo.inProgress).length;
      totals.completed = postits.filter((todo) => todo.completed).length;
    }

    if (sort) {
      data.sort((a, b) => {
        if (a[sort] < b[sort]) return -1;
        if (a[sort] > b[sort]) return 1;
        return 0;
      });
    }

    const payload: ResponsePayload = {
      backlog: postits.filter((postIt) => {
        if(!postIt.inProgress && !postIt.completed)
          return postIt;
      }),
      inProgress: postits.filter((postIt) => {
        if(postIt.inProgress && !postIt.completed)
          return postIt;
      }),
      completed: postits.filter((postIt) => {
        if(postIt.completed && !postIt.inProgress)
          return postIt;
      }),
    }

    return {
      payload,
      total,
      page,
      tags,
      totalPages: Math.ceil(total / limit),
      docCounts: totals,
    };
  }

  async setInProgress(id: string): Promise<void> {
    try {
      const postIt = await this.postItModel.findById(id).exec();
      if (!postIt) {
        throw new NotFoundException(`PostIt with ID ${id} not found`);
      }
      postIt.inProgress = !postIt.inProgress;
      postIt.completed = false;
      await postIt.save();
    } catch (error) {
      throw new HttpException(
        'failed to set postit in process',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async setCompletion(id: string): Promise<void> {
    try {
      const postIt = await this.postItModel.findById(id).exec();
      if (!postIt) {
        throw new NotFoundException(`PostIt with ID ${id} not found`);
      }
      postIt.completed = !postIt.completed;
      postIt.inProgress = false;
      await postIt.save();
    } catch (error) {
      throw new HttpException(
        'failed to set postit in process',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async findOne(id: string): Promise<PostIt> {
    const postIt = await this.postItModel.findById(id).exec();
    if (!postIt) {
      throw new NotFoundException(`PostIt with ID ${id} not found`);
    }
    return postIt;
  }

  async update(id: string, updatePostItDto: UpdatePostItDto): Promise<{payload: PostIt[]}> {
    const updatedPostIt = await this.postItModel
      .findByIdAndUpdate(id, updatePostItDto, { new: true })
      .exec();

    if (!updatedPostIt) {
      throw new NotFoundException(`PostIt with ID ${id} not found`);
    }
    const postIts = await this.postItModel.find({});
    return {payload: postIts};
  }

  async remove(id: string): Promise<void> {
    const result = await this.postItModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`PostIt with ID ${id} not found`);
    }
  }
}
