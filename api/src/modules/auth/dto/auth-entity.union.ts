import { createUnionType } from '@nestjs/graphql';
import { User } from '../../user/entities/user';
import { Client } from '../../client/entities/client';
import { ClientEmployee } from '../../client/entities/client-employee';

const AuthEntityUnion = createUnionType({
  name: 'AuthEntityUnion',
  types: () => [User, ClientEmployee],
  resolveType(value) {
    if (value.alias) {
      return User;
    } else {
      return ClientEmployee;
    }
  },
});

export { AuthEntityUnion };
