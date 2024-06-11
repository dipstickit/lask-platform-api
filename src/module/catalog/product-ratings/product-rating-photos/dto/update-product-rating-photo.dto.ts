import { PartialType } from '@nestjs/swagger';
import { CreateProductRatingPhotoDto } from './create-product-rating-photo.dto';

export class UpdateProductRatingPhotoDto extends PartialType(CreateProductRatingPhotoDto) {}
