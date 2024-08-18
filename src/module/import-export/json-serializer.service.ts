import {
  Injectable,
  StreamableFile,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileSerializer } from './models/file-serializer.interface';
import { Readable } from 'stream';

@Injectable()
export class JsonSerializer implements FileSerializer {
  async parse(data: Buffer): Promise<Record<string, any>> {
    try {
      return JSON.parse(data.toString());
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to parse JSON data',
        error.message,
      );
    }
  }

  async serialize(data: Record<string, any>): Promise<StreamableFile> {
    try {
      const parsed = JSON.stringify(data);
      return new StreamableFile(Readable.from([parsed]), {
        type: 'application/json',
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to serialize data to JSON',
        error.message,
      );
    }
  }
}
