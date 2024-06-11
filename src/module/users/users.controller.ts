import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFilterDto } from './dto/filter-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/decorator/customize';
import {
  CREATE_USER,
  DELETE_USER,
  GET_USER_DETAIL,
  GET_USER_EMAIL,
  GET_USER_TOKEN,
  GET_USERS,
  RESTORE_USER,
  UPDATE_USER,
} from 'src/utils/message';
4;
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ResponseMessage(CREATE_USER)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ResponseMessage(GET_USERS)
  findAll(query: UserFilterDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @ResponseMessage(GET_USER_DETAIL)
  findOne(@Param('id') id: number) {
    return this.usersService.findOneById(id);
  }

  @Get('email/:email')
  @ResponseMessage(GET_USER_EMAIL)
  async findOneByEmail(@Param('email') email: string) {
    return this.usersService.findOneByEmail(email);
  }

  @Get('token/:token')
  @ResponseMessage(GET_USER_TOKEN)
  async findOneByToken(@Param('token') token: string) {
    return this.usersService.findOneByToken(token);
  }
  @Put(':id')
  @ResponseMessage(UPDATE_USER)
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ResponseMessage(DELETE_USER)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('restore/:id')
  @ResponseMessage(RESTORE_USER)
  restore(@Param('id') id: string) {
    return this.usersService.restore(+id);
  }
}
