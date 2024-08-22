import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';
import { diskStorage } from 'multer';
import { fileName } from './helpers/fileNamer.helper';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@ApiTags("Files")
@Controller('files')
export class FilesController {
  constructor(    
    private readonly filesService: FilesService,
    private readonly configService:ConfigService
  ) {}
  
  @Get("product/:imageName")
  getFileById(
    @Res() res:Response,
    @Param("imageName") imageName:string
  ){
    const path = this.filesService.getStaticImage(imageName);
    res.sendFile(path);
  }


  @Post("product")
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file',{
    fileFilter:fileFilter,
    storage:diskStorage({
      destination: './uploads/products',
      filename: fileName,
    })
  }))
  uploadFile( @UploadedFile() file:Express.Multer.File){    
    if(!file)
      throw new BadRequestException('Make sure that the file is an image');
        
    const url = `${this.configService.get("HOST_API")}/files/product/${file.filename}`;
    return {url};
  }
}
