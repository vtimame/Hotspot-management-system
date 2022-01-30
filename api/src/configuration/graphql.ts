import { DynamicModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigService } from '@nestjs/config';
import { UserResolver } from '../modules/user/resolvers/user.resolver';
import { ClientResolver } from '../modules/client/resolver/client.resolver';
import { ZoneResolver } from '../modules/zone/resolvers/zone.resolver';
import { DateScalar } from '../common/scalaras/date.scalar';
import { AuthPageResolver } from '../modules/auth-page/resolvers/auth-page.resolver';
import { LoginResolver } from '../modules/auth/resolvers/login.resolver';
import { GuestSessionResolver } from '../modules/guest/resolvers/guest-session.resolver';
import { GuestDeviceResolver } from '../modules/guest/resolvers/guest-device.resolver';
import { EventResolver } from '../modules/event/resolvers/event.resolver';
import { ClientZoneResolver } from '../modules/zone/resolvers/client-zone.resolver';
import { MyAuthPageResolver } from '../modules/auth-page/resolvers/my-auth-page.resolver';
import { MyGuestSessionResolver } from '../modules/guest/resolvers/my-guest-session.resolver';
import { GuestAuthResolver } from '../modules/guest/resolvers/guest-auth.resolver';
import { DevelopmentResolver } from '../modules/development/development.resolver';
import { ClientEmployeeResolver } from '../modules/client/resolver/client-employee.resolver';

const GraphqlConfiguration: DynamicModule = GraphQLModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (c: ConfigService) => ({
    autoSchemaFile: true,
    installSubscriptionHandlers: true,
    introspection: c.get<string>('app.environment') === 'development',
    context: ({ req, res, connection }) => {
      if (connection) {
        return { req: { headers: connection.context } };
      }

      return { req, res };
    },
    subscriptions: {
      onConnect: (connectionParams) => {
        const newConnectionParams = {};
        Object.keys(connectionParams).forEach((key) => {
          newConnectionParams[key.toLowerCase()] = connectionParams[key];
        });
        return newConnectionParams;
      },
    },
    // buildSchemaOptions: {
    //   fieldMiddleware: [loggerMiddleware],
    // },
  }),
});

const Resolvers = [
  UserResolver,
  ClientResolver,
  ZoneResolver,
  AuthPageResolver,
  LoginResolver,
  GuestSessionResolver,
  GuestAuthResolver,
  GuestDeviceResolver,
  EventResolver,
  ClientZoneResolver,
  MyAuthPageResolver,
  MyGuestSessionResolver,
  DevelopmentResolver,
  ClientEmployeeResolver,
];

const GraphqlProviders = [DateScalar];

export { GraphqlConfiguration, Resolvers, GraphqlProviders };
