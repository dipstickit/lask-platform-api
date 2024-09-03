import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { AttributeType } from './models/attribute-type.entity';
import { AttributeTypesService } from './attribute-types.service';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../users/models/role.enum';
import { AttributeTypeDto } from './dto/attribute-type.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Attribute types')
@Controller('attribute-types')
export class AttributeTypesController {
  constructor(private readonly attributeTypesService: AttributeTypesService) {}

  @Get()
  @Roles(Role.Admin, Role.Manager)
  async getAttributeTypes(): Promise<AttributeType[]> {
    return this.attributeTypesService.getAttributeTypes();
  }

  @Post()
  @Roles(Role.Admin, Role.Manager)
  async createAttributeType(
    @Body() attributeType: AttributeTypeDto,
  ): Promise<AttributeType> {
    return this.attributeTypesService.createAttributeType(attributeType);
  }

  @Put('/:id')
  @Roles(Role.Admin, Role.Manager)
  async updateAttributeType(
    @Param('id', ParseIntPipe) id: number,
    @Body() attributeType: AttributeTypeDto,
  ): Promise<AttributeType> {
    return await this.attributeTypesService.updateAttributeType(
      id,
      attributeType,
    );
  }

  @Delete('/:id')
  @Roles(Role.Admin, Role.Manager)
  async deleteAttributeType(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.attributeTypesService.deleteAttributeType(id);
  }
}
