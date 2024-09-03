import {
  Body,
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

import { ImportService } from './import.service';
import { ImportDto } from './dto/import.dto';
import { ImportStatus } from './models/import-status.interface';

@ApiTags('Import-export')
@Controller('import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post('')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        clear: {
          type: 'string',
          nullable: true,
        },
        noImport: {
          type: 'string',
          nullable: true,
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
    }),
  )
  @ApiCreatedResponse({
    type: ImportStatus,
    description: 'Import status',
  })
  async import(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /(^application\/json$)|(^application\/(x-)?gzip$)/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() data: ImportDto,
  ): Promise<ImportStatus> {
    try {
      const clear = data.clear === 'true';
      const noImport = data.noImport === 'true';

      return await this.importService.import(
        file.buffer,
        file.mimetype,
        clear,
        noImport,
      );
    } catch (error) {
      throw new BadRequestException('Failed to import data');
    }
  }
}
