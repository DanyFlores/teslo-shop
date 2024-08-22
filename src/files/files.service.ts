import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
 
    getStaticImage (imageName:string) {
        const path = join(__dirname,'../../uploads/products',imageName);
        console.log(path)
        if(!existsSync(path))
            throw new BadRequestException("Not product imagen fonund");
        return path;
    }
}
