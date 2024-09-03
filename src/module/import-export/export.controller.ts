import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiCreatedResponse, ApiProduces, ApiTags } from '@nestjs/swagger';
import { ExportService } from './export.service';
import { Response } from 'express';
import { ExportDto } from './dto/export.dto';
import { fileResponseSchema } from '../local-files/models/file-response.schema';

@ApiTags('Import-export')
@Controller('export')
export class ExportController {
  constructor(private exportService: ExportService) {}

  @Post('')
  @ApiCreatedResponse({
    schema: fileResponseSchema,
    description: 'Exported data',
  })
  @ApiProduces('application/json', 'application/gzip')
  async export(
    @Res({ passthrough: true }) res: Response,
    @Body() data: ExportDto,
  ) {
    const contentType =
      data.format === 'csv' ? 'application/gzip' : 'application/json';
    res.header('Content-Type', contentType);
    res.header(
      'Content-Disposition',
      `attachment; filename="${this.exportService.getFilename(data.format)}"`,
    );
    res.header('Access-Control-Expose-Headers', 'Content-Disposition');
    return await this.exportService.export(data.data, data.format);
  }
}
