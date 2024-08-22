import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsPositive } from "class-validator";

export class PaginationDto{

    @ApiProperty({default:1,description:"Numero de pagina."})
    @IsOptional()
    @IsPositive()
    page:number;

    @ApiProperty({default:10,description:"Numero de registros por pagina."})
    @IsOptional()
    @IsPositive()
    rows:number;
}