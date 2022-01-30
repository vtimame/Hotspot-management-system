import gql from 'graphql-tag'

export const UserFragment = gql`
  fragment UserFragment on User {
    id
    name
    surname
    alias
    email
    phoneNumber
    disabledAt
  }
`

export const UsersQuery = gql`
  ${UserFragment}
  query SettingsUsersList($input: UsersInput) {
    users(input: $input) {
      ...UserFragment
    }
  }
`

export const CreateUserMut = gql`
  ${UserFragment}
  mutation SettingsCreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      ...UserFragment
    }
  }
`

export const UpdateUserMut = gql`
  ${UserFragment}
  mutation SettingsUpdateUser($id: Float!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      ...UserFragment
    }
  }
`

export const DeleteUserMut = gql`
  ${UserFragment}
  mutation SettingsDisableUser($id: Float!) {
    disableUser(id: $id) {
      ...UserFragment
    }
  }
`

export const RestoreUserMut = gql`
  ${UserFragment}
  mutation SettingsDisableUser($id: Float!) {
    restoreUser(id: $id) {
      ...UserFragment
    }
  }
`

export const UserAddedSub = gql`
  ${UserFragment}
  subscription UserAddedSub {
    userAdded {
      ...UserFragment
    }
  }
`

export const UserUpdatedSub = gql`
  ${UserFragment}
  subscription UserUpdatedSub {
    userUpdated {
      ...UserFragment
    }
  }
`
