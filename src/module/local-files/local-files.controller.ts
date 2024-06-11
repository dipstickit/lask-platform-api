import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LocalFilesService } from './local-files.service';
import { CreateLocalFileDto } from './dto/create-local-file.dto';
import { UpdateLocalFileDto } from './dto/update-local-file.dto';

@Controller('local-files')
export class LocalFilesController {
  constructor(private readonly localFilesService: LocalFilesService) {}

  @Post()
  create(@Body() createLocalFileDto: CreateLocalFileDto) {
    return this.localFilesService.create(createLocalFileDto);
  }

  @Get()
  findAll() {
    return this.localFilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.localFilesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLocalFileDto: UpdateLocalFileDto) {
    return this.localFilesService.update(+id, updateLocalFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.localFilesService.remove(+id);
  }
}
