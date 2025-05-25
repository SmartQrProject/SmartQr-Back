import { BadRequestException, Injectable, Logger, PayloadTooLargeException, PipeTransform, UnsupportedMediaTypeException } from '@nestjs/common';

const FileType = require('file-type');

@Injectable()
export class ValidateImagePipe implements PipeTransform {
  async transform(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File required');

    if (file.size > 204800) throw new PayloadTooLargeException('The file must be smaller than 200 KB');

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
      throw new UnsupportedMediaTypeException('Could not determine the file type');
    }

    Logger.debug(`Tipo detectado: ${JSON.stringify(type)}`);
    Logger.debug(`MIME desde Multer: ${file.mimetype}`);

    if (!type || !type.mime.startsWith('image/'))
      throw new UnsupportedMediaTypeException('The uploaded file is either not a valid image or its format is not supported (jpg, png, webp)');

    return file;
  }
}
