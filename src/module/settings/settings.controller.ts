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
import { SettingsService } from './settings.service';
import { Setting } from './models/setting.entity';
import { SettingCreateDto } from './dto/setting-create.dto';
import { SettingUpdateDto } from './dto/setting-update.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/models/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Public()
  @Get()
  async getSettings(): Promise<Setting[]> {
    return this.settingsService.getSettings();
  }
  @Public()
  @Get('/:id(\\d+)')
  async getSetting(@Param('id', ParseIntPipe) id: number): Promise<Setting> {
    return this.settingsService.getSetting(id);
  }

  @Public()
  @Get('/:name/value')
  async getSettingValueByName(@Param('name') name: string): Promise<string> {
    return this.settingsService.getSettingValueByName(name);
  }

  @Post()
  @Roles(Role.Admin)
  async createSetting(@Body() data: SettingCreateDto): Promise<Setting> {
    return this.settingsService.createSetting(data);
  }

  @Patch('/:id')
  @Roles(Role.Admin)
  async updateSetting(
    @Param('id') id: number,
    @Body() data: SettingUpdateDto,
  ): Promise<Setting> {
    return this.settingsService.updateSetting(id, data);
  }

  @Delete('/:id')
  @Roles(Role.Admin)
  async deleteSetting(@Param('id') id: number): Promise<void> {
    await this.settingsService.deleteSetting(id);
  }
}
