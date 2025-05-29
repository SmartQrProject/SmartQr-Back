import { Controller, FileTypeValidator, HttpCode, ParseFilePipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ValidateImagePipe } from 'src/pipes/validateImage.pipe';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UploadImageDoc } from './sawagger/cloudinary.decorator';

@ApiTags()
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @HttpCode(200)
  @Post('uploadImage')
  @UseInterceptors(FileInterceptor('file'))
  @UploadImageDoc()
  async updateImg(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp)$/ })],
      }),
      ValidateImagePipe,
    )
    file: Express.Multer.File,
  ): Promise<string> {
    /////////////////////////////////////////////////////////////////////////////////////////chequear
    return await this.cloudinaryService.updateImg(file);
  }
}
