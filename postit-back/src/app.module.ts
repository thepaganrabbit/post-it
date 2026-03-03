// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import configuration from './config';
import { PostitModule } from './postit/postit.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotesModule } from './notes/notes.module';

@Module({
  imports: [
    // 1️⃣ Load your custom config (e.g. `src/config/configuration.ts`)
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    // 2️⃣ Use forRootAsync to pull the URI from ConfigService
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // <-- make sure ConfigModule is available
      inject: [ConfigService], // <-- inject the ConfigService
      useFactory: (configService: ConfigService) => ({
        uri: `mongodb://${configService.get<string>('database.username')}:${configService.get<string>('database.password')}@${configService.get<string>('database.host')}:${configService.get<number>('database.port')}/${configService.get<string>('database.name')}?authSource=admin`,
      }),
    }),

    PostitModule,

    NotesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
