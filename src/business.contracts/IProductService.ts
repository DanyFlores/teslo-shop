import { CreateProductDto } from "src/products/dto/create-product.dto";
import { UpdateProductDto } from "src/products/dto/update-product.dto";
import { Products } from "src/products/entities/product.entity";

export interface IProductService {
    findAll(args:number[]): Promise<Products[]>;
    create(createProductDto: CreateProductDto): Promise<Products>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<Products>;
    remove(id: string): Promise<Products>;
    findOne(id: string): Promise<Products>;
   }