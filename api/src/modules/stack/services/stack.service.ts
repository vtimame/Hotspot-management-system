import { Injectable, NotFoundException } from '@nestjs/common';
import { existsSync, writeFileSync, unlinkSync, readFileSync } from 'fs';
import { mkdir } from 'shelljs';
import { nanoid } from 'nanoid';
import { StackFileRepository } from '../repositories/stack-file.repository';
import { StackFile } from '../entities/stack-file';

@Injectable()
export class StackService {
  constructor(private stackFileRepo: StackFileRepository) {}

  async createFolderIfNotExists(path: string): Promise<void> {
    if (!existsSync(path)) {
      mkdir('-p', path);
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<StackFile> {
    await this.createFolderIfNotExists(`storage/${folder}`);
    const { buffer, originalname, mimetype } = file;
    const ext = originalname.split('.')[originalname.split('.').length - 1];

    const fileName = nanoid(32) + '.' + ext;
    const path = `${folder}/${fileName}`;

    console.log(fileName, path);

    const newStackFileInstance = this.stackFileRepo.create({
      name: fileName,
      folder,
      mime: mimetype,
    });

    await writeFileSync(`storage/${path}`, buffer);
    return this.stackFileRepo.save(newStackFileInstance);
  }

  async deleteFile(name: string): Promise<StackFile> {
    const stackFileInstance = await this.stackFileRepo.findByName(name);
    if (stackFileInstance) {
      await unlinkSync(
        `storage/${stackFileInstance.folder}/${stackFileInstance.name}`,
      );
      await this.stackFileRepo.delete(stackFileInstance.id);
      return stackFileInstance;
    }

    throw new NotFoundException('File not found');
  }

  async readFile(stackFile: StackFile, size?: string): Promise<Buffer> {
    const file = await readFileSync(
      `storage/${stackFile.folder}/${stackFile.name}`,
    );
    return Buffer.from(file.buffer);
  }
}
