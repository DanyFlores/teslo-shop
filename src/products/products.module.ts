import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { ProductsRepository } from './products.repository';
import { UnitOfWork } from 'src/common/UnitOfWork/UnitOfWork';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService,ProductsRepository,UnitOfWork],
  imports:[TypeOrmModule.forFeature([Products,ProductImage])]
})
export class ProductsModule {}
