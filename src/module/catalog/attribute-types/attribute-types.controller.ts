import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AttributeTypesService } from './attribute-types.service';
import { CreateAttributeTypeDto } from './dto/create-attribute-type.dto';
import { UpdateAttributeTypeDto } from './dto/update-attribute-type.dto';

@Controller('attribute-types')
export class AttributeTypesController {
  constructor(private readonly attributeTypesService: AttributeTypesService) {}

  @Post()
  create(@Body() createAttributeTypeDto: CreateAttributeTypeDto) {
    return this.attributeTypesService.create(createAttributeTypeDto);
  }

  @Get()
  findAll() {
    return this.attributeTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attributeTypesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAttributeTypeDto: UpdateAttributeTypeDto) {
    return this.attributeTypesService.update(+id, updateAttributeTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attributeTypesService.remove(+id);
  }
}
