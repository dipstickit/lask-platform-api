import { PartialType } from '@nestjs/swagger';
import { WishlistCreateDto } from './wishlist-create.dto';

export class WishlistUpdateDto extends PartialType(WishlistCreateDto) {}
