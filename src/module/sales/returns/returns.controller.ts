import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ReturnsService } from './returns.service';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Return } from './models/return.entity';
import { User } from '../../users/models/user.entity';
import { ReqUser } from '../../auth/decorators/user.decorator';
import { ReturnCreateDto } from './dto/return-create.dto';
import { ReturnUpdateDto } from './dto/return-update.dto';
import { Role } from '../../users/models/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { OrdersService } from '../orders/orders.service';

@ApiTags('Returns')
@Controller('returns')
export class ReturnsController {
  constructor(
    private returnsService: ReturnsService,
    private ordersService: OrdersService,
  ) {}

  @Get()
  @Roles(Role.Admin, Role.Manager, Role.Sales)
  async getReturns(): Promise<Return[]> {
    return this.returnsService.getReturns();
  }

  @Get('/:id')
  @Roles(Role.Admin, Role.Manager, Role.Sales, Role.Customer)
  async getReturn(
    @ReqUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Return> {
    const checkUser = await this.returnsService.checkReturnUser(user.id, id);
    if (!checkUser && user.role === Role.Customer) {
      throw new ForbiddenException();
    }
    return await this.returnsService.getReturn(id);
  }

  @Post('')
  @Roles(Role.Admin, Role.Manager, Role.Sales, Role.Customer)
  async createReturn(
    @ReqUser() user: User,
    @Body() body: ReturnCreateDto,
  ): Promise<Return> {
    const checkUser = await this.ordersService.checkOrderUser(
      user.id,
      body.orderId,
    );
    if (!checkUser && (!user.role || user.role === Role.Customer)) {
      throw new ForbiddenException();
    }
    return await this.returnsService.createReturn(body);
  }

  @Patch('/:id')
  @Roles(Role.Admin, Role.Manager, Role.Sales)
  async updateReturn(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ReturnUpdateDto,
  ): Promise<Return> {
    return await this.returnsService.updateReturn(id, body);
  }
}
