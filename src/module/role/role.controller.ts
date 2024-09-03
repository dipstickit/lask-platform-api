import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ResponseMessage } from 'src/decorator/customize';
import {
  ROLE_CREATE_SUCCESS,
  ROLE_DELETE_SUCCESS,
  ROLE_LOAD_SUCCESS,
  ROLE_UPDATE_SUCCESS,
} from 'src/utils/message';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Roles')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ResponseMessage(ROLE_CREATE_SUCCESS)
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @ResponseMessage(ROLE_LOAD_SUCCESS)
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @ResponseMessage(ROLE_LOAD_SUCCESS)
  findOne(@Param('id') id: string) {
    return this.roleService.findOneById(+id);
  }

  @Get('name/:name')
  @ResponseMessage(ROLE_LOAD_SUCCESS)
  async findOneByName(@Param('name') name: string) {
    return this.roleService.findOneByName(name);
  }

  @Put(':id')
  @ResponseMessage(ROLE_UPDATE_SUCCESS)
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @ResponseMessage(ROLE_DELETE_SUCCESS)
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}
