import { PartialType } from '@nestjs/mapped-types';
import { CreatePostItDto } from './create-postit.dto';

export class UpdatePostItDto extends PartialType(CreatePostItDto) {}
