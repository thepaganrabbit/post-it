import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Note, NoteDocument } from './schemas/note.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>) {}

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const createdNote = new this.noteModel(createNoteDto);
    return createdNote.save();
  }

  async findAll(): Promise<{
    payload: Note[];
  }> {
    const notes = await this.noteModel.find({});

    return {
      payload: notes,
    };
  }

  async findOne(id: string): Promise<Note> {
    const note = await this.noteModel.findById(id).exec();
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return note;
  }

  async update(
    id: string,
    updateNoteDto: UpdateNoteDto,
  ): Promise<{ payload: Note }> {
    const updatedNote = await this.noteModel
      .findByIdAndUpdate(id, updateNoteDto, { new: true })
      .exec();

    if (!updatedNote) {
      throw new NotFoundException(`PostIt with ID ${id} not found`);
    }

    // No need for an additional `findOne` – we already have the updated doc
    return { payload: updatedNote };
  }

  async remove(id: string): Promise<void> {
    const result = await this.noteModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`PostIt with ID ${id} not found`);
    }
  }
}
