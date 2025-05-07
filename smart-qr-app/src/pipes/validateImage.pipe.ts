import { fileTypeFromBuffer } from 'file-type';
import { BadRequestException, Injectable, Logger, PayloadTooLargeException, PipeTransform, UnsupportedMediaTypeException } from '@nestjs/common';

@Injectable()
export class ValidateImagePipe implements PipeTransform {
  async transform(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Archivo requerido');

    if (file.size > 204800) throw new PayloadTooLargeException('El archivo debe ser menor de 200 KB');

    const type = await fileTypeFromBuffer(file.buffer);
    Logger.debug(type);
    Logger.debug('MIME:', file.mimetype);

    if (!type || !type.mime.startsWith('image/')) throw new UnsupportedMediaTypeException('El archivo no es una imagen válida o su formato no está permitido (jpg, png, webp)');

    return file;
  }
}
