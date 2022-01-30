import { DynamicModule } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

const JwtConfiguration: DynamicModule[] = [
  PassportModule.register({
    defaultStrategy: 'jwt',
    property: 'user',
    session: false,
  }),
  JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: (c: ConfigService) => ({
      secret: c.get<string>('app.jwt.secret'),
    }),
  }),
];

export { JwtConfiguration };
