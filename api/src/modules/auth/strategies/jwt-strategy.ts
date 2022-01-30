import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { BearerBodyDto } from '../dto/bearer-body.dto';
import { UserRepository } from '../../user/repositories/user.repository';
import { ClientRepository } from '../../client/repositories/client.repository';
import { ClientEmployeeRepository } from '../../client/repositories/client-employee.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userRepo: UserRepository,
    private clientRepo: ClientRepository,
    private clientEmployeeRepo: ClientEmployeeRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('app.jwt.secret'),
    });
  }

  async validate(dto: BearerBodyDto) {
    if (dto.type === 'user') {
      return this.userRepo.findOne(dto.id);
    } else if (dto.type === 'client') {
      return this.clientEmployeeRepo.findOne(dto.id);
    } else {
      return null;
    }
  }
}
