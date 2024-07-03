import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";

@Entity()
export class Products {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text',{unique:true})
    title:string;

    @Column('numeric',{default:0})
    price:number;

    @Column('text',{nullable:true})
    description:string;

    @Column('text',{unique:true})
    slug:string;

    @Column('int',{default:0})
    stock:number;

    @Column('text',{array:true})
    sizes:string[];

    @Column('text')
    gender:string;

    @OneToMany(()=>ProductImage,producImage => producImage.product,{cascade:true})    
    images?:ProductImage[];
}
