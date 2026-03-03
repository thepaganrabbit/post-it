import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { format } from 'date-fns';

export type NoteDocument = Note & Document;

@Schema({ timestamps: true })
export class Note {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  body: string;

  @Prop({ default: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss")})
  createdAt?: string;
}

export const NoteSchema = SchemaFactory.createForClass(Note);

