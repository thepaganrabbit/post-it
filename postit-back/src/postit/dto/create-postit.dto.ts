import { IsString, IsOptional, IsBoolean, IsIn, IsNumber, IsArray } from 'class-validator';

export class CreatePostItDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  @IsIn([0, 1, 2])
  priority?: 0 | 1 | 2;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsBoolean()
  dismissed?: boolean;

  @IsOptional()
  @IsBoolean()
  inProgress?: boolean;

  @IsOptional()
  @IsString()
  createdAt?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsString()
  bgColor?: string;

  @IsOptional()
  @IsString()
  foldColor?: string;
}
