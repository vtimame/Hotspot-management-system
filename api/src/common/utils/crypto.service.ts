import { Injectable } from '@nestjs/common';
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  createHash,
} from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CryptoService {
  constructor(private configService: ConfigService) {}

  async encrypt(data: string): Promise<string> {
    const algorithm = this.configService.get<string>('app.crypto.algorithm');
    const secretKey = createHash('sha256')
      .update(String(this.configService.get<string>('app.crypto.key')))
      .digest('base64')
      .substr(0, 32);
    const iv = randomBytes(16);

    const cipher = createCipheriv(algorithm, secretKey, iv);

    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);

    return JSON.stringify({
      iv: iv.toString('hex'),
      content: encrypted.toString('hex'),
    });
  }

  async decrypt(data: string): Promise<string> {
    const parsedData = JSON.parse(data);
    const algorithm = this.configService.get<string>('app.crypto.algorithm');
    const secretKey = createHash('sha256')
      .update(String(this.configService.get<string>('app.crypto.key')))
      .digest('base64')
      .substr(0, 32);

    const decipher = createDecipheriv(
      algorithm,
      secretKey,
      Buffer.from(parsedData.iv, 'hex'),
    );

    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(parsedData.content, 'hex')),
      decipher.final(),
    ]);

    return decrypted.toString();
  }
}
