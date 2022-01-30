import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StackFileRepository } from '../repositories/stack-file.repository';
import { StackService } from '../services/stack.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserAuthGuard } from '../../auth/guards/user-auth.guard';

@Controller('stack')
export class StackController {
  constructor(
    private stackFileRepo: StackFileRepository,
    private stackService: StackService,
  ) {}

  @Post('upload')
  @UseGuards(UserAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body) {
    return this.stackService.uploadFile(file, body.folder);
  }

  @Post('delete')
  @UseGuards(UserAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async deleteFile(@Body() body) {
    return this.stackService.deleteFile(body.name);
  }

  @Get('file/:folder/:name')
  async findFile(@Param() { folder, name }, @Res() res) {
    const file = await this.stackFileRepo.findOneOrFail({
      where: { folder, name },
    });

    // res.writeHead(200, { 'Content-Type': file.mime });
    res.setHeader('Content-Type', file.mime);
    res.end(await this.stackService.readFile(file));
  }
}
