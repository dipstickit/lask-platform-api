import { Injectable } from '@nestjs/common';
import { CreateLocalFileDto } from './dto/create-local-file.dto';
import { UpdateLocalFileDto } from './dto/update-local-file.dto';

@Injectable()
export class LocalFilesService {
  create(createLocalFileDto: CreateLocalFileDto) {
    return 'This action adds a new localFile';
  }

  findAll() {
    return `This action returns all localFiles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} localFile`;
  }

  update(id: number, updateLocalFileDto: UpdateLocalFileDto) {
    return `This action updates a #${id} localFile`;
  }

  remove(id: number) {
    return `This action removes a #${id} localFile`;
  }
}
