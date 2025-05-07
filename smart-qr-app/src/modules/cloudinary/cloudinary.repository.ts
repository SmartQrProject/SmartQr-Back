/* eslint-disable */

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadResponseCallback } from 'cloudinary';
import { Writable } from 'stream';
const toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryRepository {
  async updateImg(file: Express.Multer.File): Promise<string> {
    const newImg: UploadApiResponse = await new Promise((resolve, reject) => {
      const uploadCallback: UploadResponseCallback = (error: any, result: any) => {
        error ? reject(new InternalServerErrorException(error.message || 'Upload failed')) : resolve(result);
      };

      const upload: Writable = cloudinary.uploader.upload_stream({ resource_type: 'auto' }, uploadCallback);

      toStream(file.buffer).pipe(upload);
    });

    return newImg.secure_url;
  }
}
