// src/modules/import/presentation/controllers/import.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportCSVUseCase } from '../../application/usecases/import-csv.usecase';

@Controller('api/import')
export class ImportController {
  constructor(private readonly importCSVUseCase: ImportCSVUseCase) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async importCSV(@UploadedFile() file: Express.Multer.File) {
    return this.importCSVUseCase.execute(file.buffer);
  }
}
