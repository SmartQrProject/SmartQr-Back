import {
  BadRequestException,
  Injectable,
  Logger,
  PayloadTooLargeException,
  PipeTransform,
  UnsupportedMediaTypeException,
} from '@nestjs/common';

const FileType = require('file-type');

@Injectable()
export class ValidateImagePipe implements PipeTransform {
  async transform(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Archivo requerido');

    if (file.size > 204800)
      throw new PayloadTooLargeException('El archivo debe ser menor de 200 KB');

    let type;
    try {
      if (typeof FileType === 'function') {
        type = await FileType(file.buffer);
      } else if (typeof FileType.fileTypeFromBuffer === 'function') {
        type = await FileType.fileTypeFromBuffer(file.buffer);
      } else if (typeof FileType.fromBuffer === 'function') {
        type = await FileType.fromBuffer(file.buffer);
      } else {
        Logger.error('FileType methods available:', Object.keys(FileType));
        throw new Error('No compatible file-type method found');
      }
    } catch (error) {
      Logger.error('Error detecting file type:', error);
      throw new UnsupportedMediaTypeException(
        'No se pudo determinar el tipo de archivo',
      );
    }

    Logger.debug(`Tipo detectado: ${JSON.stringify(type)}`);
    Logger.debug(`MIME desde Multer: ${file.mimetype}`);

    if (!type || !type.mime.startsWith('image/'))
      throw new UnsupportedMediaTypeException(
        'El archivo no es una imagen válida o su formato no está permitido (jpg, png, webp)',
      );

    return file;
  }
}
