import { UserService } from '../modules/user/services/user.service';
import { UserLoginService } from '../modules/auth/services/user-login.service';
import { UserPasswordService } from '../modules/user/services/user-password.service';
import { SmsService } from '../modules/sms/services/sms.service';
import { UserTokenService } from '../modules/user/services/user-token.service';
import { ClientService } from '../modules/client/services/client.service';
import { ClientLoginService } from '../modules/auth/services/client-login.service';
import { ZoneService } from '../modules/zone/services/zone.service';
import { CryptoService } from '../common/utils/crypto.service';
import { StackService } from '../modules/stack/services/stack.service';
import { AuthPageService } from '../modules/auth-page/services/auth-page.service';
import { ClientPasswordService } from '../modules/client/services/client-password.service';
import { GuestDeviceService } from '../modules/guest/services/guest-device.service';
import { GuestAttemptService } from '../modules/guest/services/guest-attempt.service';
import { GuestAuthService } from '../modules/guest/services/guest-auth.service';
import { RadiusCheckService } from '../modules/radius/services/radius-check.service';
import { GuestSessionService } from '../modules/guest/services/guest-session.service';
import { EventService } from '../modules/event/services/event.service';
import { GuestSessionTimeoutService } from '../modules/guest/services/guest-session-timeout.service';
import { ClientEmployeeService } from '../modules/client/services/client-employee.service';

const Services = [
  UserService,
  UserLoginService,
  UserPasswordService,
  SmsService,
  UserTokenService,
  ClientService,
  ClientLoginService,
  ZoneService,
  CryptoService,
  StackService,
  AuthPageService,
  ClientPasswordService,
  GuestDeviceService,
  GuestAttemptService,
  GuestAuthService,
  GuestSessionService,
  RadiusCheckService,
  EventService,
  GuestSessionTimeoutService,
  ClientEmployeeService,
];

export { Services };
