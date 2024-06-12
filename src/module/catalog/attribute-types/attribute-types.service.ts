import { Injectable } from '@nestjs/common';
import { CreateAttributeTypeDto } from './dto/create-attribute-type.dto';
import { UpdateAttributeTypeDto } from './dto/update-attribute-type.dto';

@Injectable()
export class AttributeTypesService {
  create(createAttributeTypeDto: CreateAttributeTypeDto) {
    return 'This action adds a new attributeType';
  }

  findAll() {
    return `This action returns all attributeTypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} attributeType`;
  }

  update(id: number, updateAttributeTypeDto: UpdateAttributeTypeDto) {
    return `This action updates a #${id} attributeType`;
  }

  remove(id: number) {
    return `This action removes a #${id} attributeType`;
  }
}
