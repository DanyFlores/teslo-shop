import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Products } from './entities/product.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IProductService } from 'src/business.contracts/IProductService';
import { ProductImage } from './entities/product-image.entity';
import { ProductsRepository } from './products.repository';
import { UnitOfWork } from 'src/common/UnitOfWork/UnitOfWork';

@Injectable()
export class ProductsService implements IProductService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    // @InjectRepository(Products)
    // private readonly _productRepository: Repository<Products>,
    // @InjectRepository(ProductImage)
    // private readonly _productImageRepository: Repository<ProductImage>,
    private readonly repository: ProductsRepository,
    private readonly _UnitOfWork: UnitOfWork
  ) { }

  async create(createProductDto: CreateProductDto): Promise<Products> {
    try {

      const queryRunner = await this._UnitOfWork.BeginTransaction();
      await this.repository.initialize(queryRunner);
      var product = await this.repository.create(createProductDto);

      await queryRunner.manager.save(product);

      await this._UnitOfWork.Commit();
      await this._UnitOfWork.Dispose();

      return product;
    } catch (error) {
      this._UnitOfWork.Rollback();
      this._UnitOfWork.Dispose();
      this.handleExceptions(error)
    }
  }

  async findAll(args: number[]): Promise<Products[]> {

    const queryRunner = await this._UnitOfWork.BeginTransaction();

    await this.repository.initialize(queryRunner)

    var result: Products[] = await this.repository.findAll(args);
    await this._UnitOfWork.Dispose();
    return result;

  }
  async findOne(id: string): Promise<Products> {
    const queryRunner= await this._UnitOfWork.BeginTransaction();    
    await this.repository.initialize(queryRunner);
    
    var result = await this.repository.findOne(id);
    await this._UnitOfWork.Dispose()
    return result;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Products> {
    try {
      const { images } = updateProductDto;

      const queryRunner = await this._UnitOfWork.BeginTransaction();

      await this.repository.initialize(queryRunner);

      const product = await this.repository.update(id, updateProductDto);
      if (images) {
        product.images = await this.repository.UpdateImagesByProduct(id, images);
      }

      await queryRunner.manager.save(product);

      await this._UnitOfWork.Commit();
      await this._UnitOfWork.Dispose();

      return product;
    } catch (error) {
      await this._UnitOfWork.Rollback();
      await this._UnitOfWork.Dispose();
      this.handleExceptions(error);
    }
  }

  async remove(id: string): Promise<Products> {
    try {
      const queryRunner = await this._UnitOfWork.BeginTransaction();
      await this.repository.initialize(queryRunner);

      var result = await this.repository.remove(id);

      await this._UnitOfWork.Commit();

      return result;
    } catch (error) {
      await this._UnitOfWork.Rollback();
      this.handleExceptions(error);
    }finally{
      await this._UnitOfWork.Dispose();
    }
  }

  private handleExceptions = (error: any) => {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
