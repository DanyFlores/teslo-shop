import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Products {
    @ApiProperty({example:"1b0e7780-047c-4797-a2c8-0de7bd71aeef",description:"Product Id",uniqueItems:true})
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @ApiProperty()
    @Column('text',{unique:true})
    title:string;

    @ApiProperty()
    @Column('numeric',{default:0})
    price:number;

    @ApiProperty()
    @Column('text',{nullable:true})
    description:string;

    @ApiProperty()
    @Column('text',{unique:true})
    slug:string;

    @ApiProperty()
    @Column('int',{default:0})
    stock:number;

    @ApiProperty()
    @Column('text',{array:true})
    sizes:string[];

    @ApiProperty()
    @Column('text')
    gender:string;

    @ApiProperty()
    @OneToMany(()=>ProductImage,producImage => producImage.product,{cascade:true})    
    images?:ProductImage[];
}
