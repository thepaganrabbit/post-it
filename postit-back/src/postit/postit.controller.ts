import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param, 
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PostitService } from './postit.service';
import { CreatePostItDto } from './dto/create-postit.dto';
import { UpdatePostItDto } from './dto/update-postit.dto';

@Controller('postit')
export class PostitController {
  constructor(private readonly postitService: PostitService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPostItDto: CreatePostItDto) {
    return this.postitService.create(createPostItDto);
  }

  @Post('inProgress')
  @HttpCode(HttpStatus.ACCEPTED)
  updateProgress(@Query('id') id: string) {
    return this.postitService.setInProgress(id);
  }

  @Post('isCompleted')
  @HttpCode(HttpStatus.ACCEPTED)
  changeCompletion(@Query('id') id: string) {
    return this.postitService.setCompletion(id);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.postitService.findAll(pageNumber, limitNumber, sort);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postitService.findOne(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updatePostItDto: UpdatePostItDto) {
    return this.postitService.update(id, updatePostItDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.postitService.remove(id);
  }
}
