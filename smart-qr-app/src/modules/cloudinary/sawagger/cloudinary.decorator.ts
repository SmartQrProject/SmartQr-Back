import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';

export function UploadImageDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'Subir o actualizar una imagen de usuario (JPEG, PNG o WebP)(requiere autenticación)',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Imagen subida exitosamente (URL retornada)',
    }),
    ApiResponse({
      status: 400,
      description: 'Archivo requerido',
    }),
    ApiResponse({
      status: 401,
      description: 'No autorizado',
    }),
    ApiResponse({
      status: 413,
      description: 'El archivo debe ser menor de 200 KB',
    }),
    ApiResponse({
      status: 415,
      description: 'El archivo no es una imagen válida o su formato no está permitido (jpg, png, webp)',
    }),
  );
}
