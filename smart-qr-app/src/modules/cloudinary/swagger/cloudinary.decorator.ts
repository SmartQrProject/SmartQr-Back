import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiConsumes, ApiBody, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

export function UploadImageDoc() {
  return applyDecorators(
    ApiTags('Cloudinary'),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Upload an image to Cloudinary',
      description: 'Upload an image file to Cloudinary storage. Only accessible by restaurant owners. The image will be processed and stored using the smart-qr preset configuration.'
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: ['file'],
        properties: {
          file: {
            type: 'string',
            format: 'binary',
            description: 'Image file to upload (JPEG, PNG, or WebP format, max 200KB)'
          }
        }
      }
    }),
    ApiResponse({
      status: 200,
      description: 'Image uploaded successfully',
      schema: {
        type: 'string',
        format: 'uri',
        description: 'Secure URL of the uploaded image',
        example: 'https://res.cloudinary.com/dsrcokjsp/image/upload/v1234567890/example.jpg'
      }
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: { type: 'string', example: 'File required' },
          error: { type: 'string', example: 'Bad Request' }
        }
      }
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Valid authentication token required'
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - User does not have Owner role'
    }),
    ApiResponse({
      status: 413,
      description: 'Payload Too Large',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 413 },
          message: { type: 'string', example: 'The file must be smaller than 200 KB' },
          error: { type: 'string', example: 'Payload Too Large' }
        }
      }
    }),
    ApiResponse({
      status: 415,
      description: 'Unsupported Media Type',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 415 },
          message: { type: 'string', example: 'The file is not a valid image or its format is not allowed (jpg, png, webp)' },
          error: { type: 'string', example: 'Unsupported Media Type' }
        }
      }
    }),
    ApiResponse({
      status: 500,
      description: 'Internal Server Error',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 500 },
          message: { type: 'string', example: 'Error verifying upload preset' },
          error: { type: 'string', example: 'Internal Server Error' }
        }
      }
    })
  );
}
