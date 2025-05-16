import {
  Controller,
  FileTypeValidator,
  HttpCode,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ValidateImagePipe } from 'src/pipes/validateImage.pipe';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags()
@ApiBearerAuth()
//@UseGuards(AuthGuard)
@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @ApiOperation({
    summary:
      'Subir o actualizar una imagen de usuario (JPEG, PNG o WebP)(requiere autenticación)',
  })
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
  @ApiResponse({
    status: 200,
    description: 'Imagen subida exitosamente (URL retornada)',
  })
  @ApiResponse({ status: 400, description: 'Archivo requerido' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({
    status: 413,
    description: 'El archivo debe ser menor de 200 KB',
  })
  @ApiResponse({
    status: 415,
    description:
      'El archivo no es una imagen válida o su formato no está permitido (jpg, png, webp)',
  })
  @HttpCode(200)
  @Post('uploadImage')
  @UseInterceptors(FileInterceptor('file'))
  async updateImg(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp)$/ }),
        ],
      }),
      ValidateImagePipe,
    )
    file: Express.Multer.File,
  ) /*: Promise<string>*/ {
    console.log('file', file);
    console.log('file buffer', file.buffer);
    /////////////////////////////////////////////////////////////////////////////////////////chequear
    return await this.cloudinaryService.updateImg(file);
  }
}
