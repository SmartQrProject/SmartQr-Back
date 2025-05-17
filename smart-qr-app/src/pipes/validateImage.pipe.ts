import {
  BadRequestException,
  Injectable,
  Logger,
  PayloadTooLargeException,
  PipeTransform,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
const fileType = require('file-type');
//import { fileTypeFromBuffer } from 'file-type'; // ✅ cambio necesario

@Injectable()
export class ValidateImagePipe implements PipeTransform {
  async transform(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Archivo requerido');

    if (file.size > 204800)
      throw new PayloadTooLargeException('El archivo debe ser menor de 200 KB');

    //const type = await fileTypeFromBuffer(file.buffer);
    const type = await fileType(file.buffer);
    Logger.debug(`Tipo detectado: ${JSON.stringify(type)}`);
    Logger.debug(`MIME desde Multer: ${file.mimetype}`);

    if (!type || !type.mime.startsWith('image/'))
      throw new UnsupportedMediaTypeException(
        'El archivo no es una imagen válida o su formato no está permitido (jpg, png, webp)',
      );

    return file;
  }
}
