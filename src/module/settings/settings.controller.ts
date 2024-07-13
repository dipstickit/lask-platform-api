import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Post,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Setting } from './entities/setting.entity';

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get()
  async getSettings(): Promise<Setting[]> {
    return this.settingsService.getSettings();
  }

  @Get('/:id(\\d+)')
  async getSetting(@Param('id', ParseIntPipe) id: number): Promise<Setting> {
    return this.settingsService.getSetting(id);
  }

  @Get('/:name/value')
  async getSettingValueByName(@Param('name') name: string): Promise<string> {
    return this.settingsService.getSettingValueByName(name);
  }

  @Post()
  async createSetting(@Body() data: CreateSettingDto): Promise<Setting> {
    return this.settingsService.createSetting(data);
  }

  @Put('/:id')
  async updateSetting(
    @Param('id') id: number,
    @Body() data: UpdateSettingDto,
  ): Promise<Setting> {
    return this.settingsService.updateSetting(id, data);
  }

  @Delete('/:id')
  async deleteSetting(@Param('id') id: number): Promise<void> {
    await this.settingsService.deleteSetting(id);
  }
}
