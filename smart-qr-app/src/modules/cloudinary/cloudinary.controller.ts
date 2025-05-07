import {
  Controller,
  FileTypeValidator,
  HttpCode,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
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

@ApiTags('Cloudinary')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller()
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @ApiOperation({
    summary:
      'Subir o actualizar una imagen de usuario (JPEG, PNG o WebP)(requiere autenticación)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del producto',
    example: 'uuid-válido',
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
  @Put('uploadImage/:id')
  @UseInterceptors(FileInterceptor('file'))
  async updateImg(
    @Param('id', ParseUUIDPipe) id: string,
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
    /////////////////////////////////////////////////////////////////////////////////////////chequear
    return await this.cloudinaryService.updateImg(id, file);
  }
}
