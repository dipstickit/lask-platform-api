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
import { PaymentMethodsService } from './payment-methods.service';
import { PaymentMethod } from './models/payment-method.entity';
import { PaymentMethodDto } from './dto/payment-method.dto';
import { Role } from '../../users/models/role.enum';
import { Roles } from '../../auth/decorators/roles.decorator';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Payment methods')
@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Get()
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return this.paymentMethodsService.getMethods();
  }

  @Post()
  @Roles(Role.Admin)
  @ApiCreatedResponse({
    type: PaymentMethod,
    description: 'Payment method created',
  })
  async createPaymentMethod(
    @Body() methodData: PaymentMethodDto,
  ): Promise<PaymentMethod> {
    return this.paymentMethodsService.createMethod(methodData);
  }

  @Put(':id')
  @Roles(Role.Admin)
  async updatePaymentMethod(
    @Param('id', ParseIntPipe) id: number,
    @Body() methodData: PaymentMethodDto,
  ): Promise<PaymentMethod> {
    return this.paymentMethodsService.updateMethod(id, methodData);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async deletePaymentMethod(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.paymentMethodsService.deleteMethod(id);
  }
}
