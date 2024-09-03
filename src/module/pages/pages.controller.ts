import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { PagesService } from './pages.service';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/models/role.enum';
import { PageCreateDto } from './dto/page-create.dto';
import { PageUpdateDto } from './dto/page-update.dto';

@ApiTags('Pages')
@Controller('pages')
export class PagesController {
  constructor(private pagesService: PagesService) {}

  @Get()
  async getPages() {
    return await this.pagesService.getPages();
  }

  @Get('groups')
  async getPageGroups() {
    return await this.pagesService.getPageGroups();
  }

  @Get(':id')
  async getPage(@Param('id', ParseIntPipe) id: number) {
    return await this.pagesService.getPage(id);
  }

  @Post()
  @Roles(Role.Admin)
  async createPage(@Body() data: PageCreateDto) {
    return await this.pagesService.createPage(data);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  async updatePage(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: PageUpdateDto,
  ) {
    return await this.pagesService.updatePage(id, data);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async deletePage(@Param('id', ParseIntPipe) id: number) {
    await this.pagesService.deletePage(id);
  }
}
