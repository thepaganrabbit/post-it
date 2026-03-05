import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { format } from 'date-fns';

export type PostItDocument = PostIt & Document;

@Schema({ timestamps: true })
export class PostIt {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Number, enum: [0, 1, 2], default: 0 })
  priority?: number;

  @Prop({ default: false })
  completed?: boolean;

  @Prop({ type: String, default: null })
  completedOn?: string | null;

  @Prop({ default: false })
  dismissed?: boolean;

  @Prop({ default: false })
  inProgress?: boolean;

  @Prop({ default: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss")})
  createdAt?: string;

  @Prop({default: []})
  tags: string[]

  @Prop()
  bgColor?: string;

  @Prop()
  foldColor?: string;
}

export const PostItSchema = SchemaFactory.createForClass(PostIt);

