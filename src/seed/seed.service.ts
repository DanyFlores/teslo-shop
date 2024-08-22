import { Injectable } from '@nestjs/common';
import { initialData } from './data/initialData';
import { ProductsService } from 'src/products/products.service';
import { ProductsRepository } from 'src/products/products.repository';
import { UnitOfWork } from 'src/common/UnitOfWork/UnitOfWork';
import { Products } from 'src/products/entities/product.entity';

@Injectable()
export class SeedService {

  constructor(
    private readonly repository: ProductsRepository,
    private readonly _UnitOfWork: UnitOfWork
  ) {
  }

  async runSeed() {
    await this.insertSeeds();

    return "seedExecuted";
  }

  private async insertSeeds() {
    try {

      const seetProducts = initialData.products;

      const queryRunner = await this._UnitOfWork.BeginTransaction();
      await this.repository.initialize(queryRunner);
      await this.repository.DeleteAll();
      let array= []
      seetProducts.map((prod) => {
        array.push(this.repository.createTst(prod));
      });

      let res = await Promise.all(array).then( res=> res);

      await queryRunner.manager.save(res);

      await this._UnitOfWork.Commit();
      await this._UnitOfWork.Dispose();
      return true;
    } catch (error) {
      this._UnitOfWork.Rollback();
      this._UnitOfWork.Dispose();
      // this.handleExceptions(error)
    }
  }
}
