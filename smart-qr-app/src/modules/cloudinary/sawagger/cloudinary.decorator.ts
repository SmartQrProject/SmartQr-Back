import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';

// Utilidades reutilizables
function UploadFileBodyDoc() {
  return ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  });
}

function UploadFileCommonResponses() {
  return applyDecorators(
    ApiResponse({ status: 200, description: 'Image uploaded successfully (URL returned)' }),
    ApiResponse({ status: 400, description: 'File required' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 413, description: 'The file must be smaller than 200 KB' }),
    ApiResponse({
      status: 415,
      description: 'The file is not a valid image or its format is not allowed (jpg, png, webp)',
    }),
  );
}

// Decorador final
export function UploadImageDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'Upload or update a user image (JPEG, PNG, or WebP) (authentication required)',
    }),
    ApiConsumes('multipart/form-data'),
    UploadFileBodyDoc(),
    UploadFileCommonResponses(),
  );
}
