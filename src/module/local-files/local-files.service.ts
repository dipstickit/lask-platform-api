import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { createReadStream, promises as fsPromises } from 'fs';
import * as path from 'path';
import { SettingsService } from '../settings/settings.service';
import { Readable } from 'stream';

@Injectable()
export class LocalFilesService {
  constructor(private readonly settingsService: SettingsService) {}

  async getPhoto(filepath: string, mimeType: string): Promise<Readable> {
    const fullPath = path.join(process.cwd(), filepath);
    const stream = createReadStream(fullPath);
    stream.on('error', () => {
      throw new Error('File not found');
    });
    return stream;
  }

  async savePhoto(
    file: Express.Multer.File,
  ): Promise<{ path: string; mimeType: string }> {
    const convertToJPEG =
      (await this.settingsService.getSettingValueByName(
        'Convert images to JPEG',
      )) === 'true';

    if (!convertToJPEG) {
      return { path: file.path, mimeType: file.mimetype };
    }

    const buffer = await sharp(file.path)
      .flatten({ background: '#ffffff' })
      .jpeg({ quality: 95, mozjpeg: true })
      .toBuffer();

    await fsPromises.writeFile(file.path, buffer);
    return { path: file.path, mimeType: 'image/jpeg' };
  }

  async createPhotoThumbnail(path: string): Promise<string> {
    const outputPath = `${path}-thumbnail`;
    const size = Math.abs(
      parseInt(
        await this.settingsService.getSettingValueByName('Thumbnail size'),
      ),
    );

    await sharp(path)
      .resize(size, size, { fit: 'contain', background: '#ffffff' })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(outputPath);

    return outputPath;
  }

  async createPhotoPlaceholder(path: string): Promise<string> {
    const buffer = await sharp(path)
      .resize(12, 12, { fit: 'contain', background: '#ffffff' })
      .toBuffer();

    return `data:image/png;base64,${buffer.toString('base64')}`;
  }
}
