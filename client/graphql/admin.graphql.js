import gql from 'graphql-tag'

export const AuthUserQuery = gql`
  query AuthUser {
    authUser {
      id
      name
      surname
      phoneNumber
      alias
      email
    }
  }
`
