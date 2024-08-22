import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductsModule } from 'src/products/products.module';
import { UnitOfWork } from 'src/common/UnitOfWork/UnitOfWork';
import { ProductsRepository } from 'src/products/products.repository';

@Module({
  controllers: [SeedController],
  providers: [SeedService,ProductsRepository,UnitOfWork],
  imports:[ProductsModule]
})
export class SeedModule {}
