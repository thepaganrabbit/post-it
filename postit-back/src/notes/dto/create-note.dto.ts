import { IsString, IsOptional } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsOptional()
  @IsString()
  createdAt?: string;
}
