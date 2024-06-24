import { Injectable, OnModuleInit } from '@nestjs/common';
import { QueryFailedError, Repository } from 'typeorm';
import { Setting } from './models/setting.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SettingType } from './models/setting-type.enum';
import validator from 'validator';
const { isISO4217, isISO31661Alpha2 } = validator;
import { isBooleanString, isNumberString, isString } from 'class-validator';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { NotFoundError } from '../errors/not-found.error';
import { ConflictError } from '../errors/conflict.error';
import { TypeCheckError } from '../errors/type-check.error';
import { BUILTIN_SETTINGS } from './data/builtin-settings.data';

@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(
    @InjectRepository(Setting) private settingsRepository: Repository<Setting>,
  ) {}

  async onModuleInit() {
    try {
      for (const setting of BUILTIN_SETTINGS) {
        await this.createSetting(setting);
      }
    } catch (e) {
      if (e instanceof QueryFailedError) {
        console.error('Builtin settings already exist');
      } else {
        throw e;
      }
    }
  }

  async getSettings(): Promise<Setting[]> {
    return this.settingsRepository.find();
  }

  async getSetting(id: number): Promise<Setting> {
    const setting = await this.settingsRepository.findOne({ where: { id } });
    if (!setting) {
      throw new NotFoundError('setting', 'id', id.toString());
    }
    return setting;
  }

  async findSettingByName(name: string): Promise<Setting | null> {
    return await this.settingsRepository.findOne({ where: { name } });
  }

  async getSettingValueByName(name: string): Promise<string> {
    const setting = await this.findSettingByName(name);
    if (!setting) {
      throw new NotFoundError('setting', 'name', name);
    }
    return setting.value;
  }

  async createSetting(data: CreateSettingDto): Promise<Setting> {
    try {
      const setting = new Setting();
      setting.builtin = data.builtin;
      setting.name = data.name;
      setting.description = data.description;
      setting.type = data.type;
      await this.checkSettingType(
        setting.type,
        data.value ?? data.defaultValue,
      );
      setting.defaultValue = data.defaultValue;
      setting.value = data.value ?? data.defaultValue;
      return await this.settingsRepository.save(setting);
    } catch (e) {
      if (e instanceof QueryFailedError) {
        throw new ConflictError('setting', 'name', data.name);
      }
      throw e;
    }
  }

  async updateSetting(id: number, data: UpdateSettingDto): Promise<Setting> {
    const setting = await this.settingsRepository.findOne({ where: { id } });
    if (!setting) {
      throw new NotFoundError('setting', 'id', id.toString());
    }
    await this.checkSettingType(setting.type, data.value);
    setting.value = data.value;
    return this.settingsRepository.save(setting);
  }

  private async checkSettingType(type: SettingType, value: string) {
    if (type === SettingType.CountriesList) {
      const countries = value.split(',');
      if (!countries.every((c) => isISO31661Alpha2(c))) {
        throw new TypeCheckError(
          'setting value',
          'array of alpha2 country codes',
        );
      }
    }
    if (type === SettingType.CurrenciesList) {
      const currencies = value.split(',');
      if (!currencies.every((c) => isISO4217(c))) {
        throw new TypeCheckError('setting value', 'array of currency codes');
      }
    }
    (<[SettingType, (value: string) => boolean][]>[
      [SettingType.String, isString],
      [SettingType.Boolean, isBooleanString],
      [SettingType.Number, isNumberString],
      [SettingType.Currency, isISO4217],
      [SettingType.Country, isISO31661Alpha2],
    ]).forEach((check) => {
      if (type === check[0] && !check[1](value)) {
        throw new TypeCheckError('setting value', check[0]);
      }
    });
  }

  async deleteSetting(id: number, ignoreBuiltin = false): Promise<boolean> {
    const setting = await this.settingsRepository.findOne({ where: { id } });
    if (!setting || (setting.builtin && !ignoreBuiltin)) {
      throw new NotFoundError('setting', 'id', id.toString());
    }
    await this.settingsRepository.delete({ id });
    return true;
  }
}
