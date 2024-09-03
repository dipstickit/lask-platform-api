import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { DeliveryMethodsService } from './delivery-methods.service';
import { DeliveryMethod } from './models/delivery-method.entity';
import { DeliveryMethodDto } from './dto/delivery-method.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../users/models/role.enum';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Delivery methods')
@Controller('delivery-methods')
export class DeliveryMethodsController {
  constructor(
    private readonly deliveryMethodsService: DeliveryMethodsService,
  ) {}

  @Get()
  async getDeliveryMethods(): Promise<DeliveryMethod[]> {
    return this.deliveryMethodsService.getMethods();
  }

  @Post()
  @Roles(Role.Admin)
  async createDeliveryMethod(
    @Body() body: DeliveryMethodDto,
  ): Promise<DeliveryMethod> {
    return this.deliveryMethodsService.createMethod(body);
  }

  @Put(':id')
  @Roles(Role.Admin)
  async updateDeliveryMethod(
    @Param('id') id: number,
    @Body() body: DeliveryMethodDto,
  ): Promise<DeliveryMethod> {
    return await this.deliveryMethodsService.updateMethod(id, body);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async deleteDeliveryMethod(@Param('id') id: number): Promise<void> {
    await this.deliveryMethodsService.deleteMethod(id);
  }
}
