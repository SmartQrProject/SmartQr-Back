/* eslint-disable */

import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadResponseCallback,
} from 'cloudinary';
import { Writable } from 'stream';
const toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryRepository {
  private readonly logger = new Logger(CloudinaryRepository.name);

  async updateImg(file: Express.Multer.File): Promise<string> {
    this.logger.debug('Cloudinary config:', {
      cloud_name: cloudinary.config().cloud_name,
      api_key: cloudinary.config().api_key ? '***' : 'undefined',
      api_secret: cloudinary.config().api_secret ? '***' : 'undefined',
    });

    // Verificar el preset
    try {
      const presets = await cloudinary.api.upload_presets();
      this.logger.debug('Available upload presets:', presets);
      
      const smartQrPreset = presets.presets.find(p => p.name === 'smart-qr');
      if (!smartQrPreset) {
        this.logger.error('smart-qr preset not found in available presets');
        throw new InternalServerErrorException('Upload preset configuration error');
      }
      this.logger.debug('Found smart-qr preset:', smartQrPreset);
    } catch (error) {
      this.logger.error('Error checking upload presets:', error);
      throw new InternalServerErrorException('Error verifying upload preset');
    }

    const newImg: UploadApiResponse = await new Promise((resolve, reject) => {
      const uploadCallback: UploadResponseCallback = (
        error: any,
        result: any,
      ) => {
        if (error) {
          this.logger.error('Cloudinary upload error:', error);
          reject(
            new InternalServerErrorException(
              error.message || 'Upload failed',
            ),
          );
        } else {
          this.logger.debug('Cloudinary upload success:', result);
          resolve(result);
        }
      };

      const upload: Writable = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          upload_preset: 'smart-qr',
          overwrite: false,
          use_filename: false,
          unique_filename: false,
          use_filename_as_display_name: true,
          use_asset_folder_as_public_id_prefix: false,
          type: 'upload'
        },
        uploadCallback,
      );

      toStream(file.buffer).pipe(upload);
    });

    return newImg.secure_url;
  }
}
