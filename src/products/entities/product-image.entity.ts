import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Products } from "./product.entity";

@Entity()
export class ProductImage{
    @PrimaryGeneratedColumn()
    id:number;

    @Column('text')
    url:string;

    @ManyToOne(
        ()=> Products,
        (product)=>product.images,
        {onDelete:'CASCADE'}  
    )
    product:Products
}