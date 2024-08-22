import { QueryRunner } from "typeorm";
import { Products } from "./entities/product.entity";
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { ProductImage } from "./entities/product-image.entity";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductsRepository {

    private _queryRunner: QueryRunner;

    async initialize(queryRunner: QueryRunner) {
        this._queryRunner = queryRunner;
    }

    async findAll(args: number[]): Promise<Products[]> {
        return await this._queryRunner.manager.find(Products, {
            take: args[1],
            skip: args[0] - 1,
            relations: {
                images: true
            }
        });
    }

    async create(createProductDto: CreateProductDto): Promise<Products> {
        try {
            const { images, ...productDetail } = createProductDto;
            const product = await this._queryRunner.manager.create(Products, {
                ...productDetail,
                images: images.map((image) => this.saveImage(image))
            });
            return product;
        } catch (error) {
              console.log("error->",error)
        }
    }
    async createTst(createProductDto: CreateProductDto): Promise<Products> {
        try {
            const { images, ...productDetail } = createProductDto;           
            const product =  this._queryRunner.manager.create(Products, {
                ...productDetail,
                images: await this.saveImageTst(images)
            });
           
            return product;
        } catch (error) {
              console.log("error->",error)
        }
    }
    async update(id: string, updateProductDto: UpdateProductDto): Promise<Products> {

        const { images, ...rest } = updateProductDto;

        const product = await this._queryRunner.manager.preload(Products, {
            id,
            ...rest
        });

        if (!product) throw new NotFoundException(`Product with id: ${id} not found`);

        return product
    }

    async UpdateImagesByProduct(id: string, images: string[]): Promise<ProductImage[]> {
        await this._queryRunner.manager.delete(ProductImage, { product: { id: id } });
        var prodImages = images.map(
           image => this.saveImage(image)
        );
        return prodImages;
    }

    async findOne(id: string): Promise<Products> {
        const producto = await this._queryRunner.manager.findOneBy(Products, { id })

        if (!producto) throw new NotFoundException(`El producto con el Id ${id} no se a encontrado.`);

        return producto;
    }
    async remove(id: string): Promise<Products> {
        const producto = await this.findOne(id);
        return await this._queryRunner.manager.remove(producto);
      }
    
    saveImage(image: string) {
        try {
            return this._queryRunner.manager.create(ProductImage, { url: image });
        } catch (error) {
              console.log("error->",error)
        }
    }
    async saveImageTst(images: string[]){
        try {
            let array:ProductImage[]=[];
            images.map(async(image) =>{
                 array.push(this._queryRunner.manager.create(ProductImage, { url: image}));
            })
            return await Promise.all(array).then(res=>{
                return res
            });            
        } catch (error) {
              console.log("error->",error)
        }
    }

    async DeleteAll(){
        return await this._queryRunner.manager.query('DELETE FROM "products"');
    }
}