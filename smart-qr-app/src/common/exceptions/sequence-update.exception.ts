import { HttpException, HttpStatus } from '@nestjs/common';

export class SequenceUpdateException extends HttpException {
  constructor(message: string) {
    super(
      {
        message,
        error: 'Sequence Update Failed',
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
} 