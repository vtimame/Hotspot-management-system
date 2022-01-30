import gql from 'graphql-tag'

const AuthPageFragment = gql`
  fragment AuthPageFragment on AuthPage {
    id
    clientId
    title
    textColor
    buttonColor
    buttonTextColor
    backgroundColor
    termsColor
    logoImage
    backgroundImage
    bannerImage
    backgroundSize
    backgroundRepeat
    backgroundPosition
    zone {
      id
      name
      authTypes
    }
  }
`

export const ClientQuery = gql`
  query AuthClientQuery {
    authClient {
      id
      name
      surname
      phoneNumber
      email

      company {
        id
        name
      }
    }
  }
`

export const ZonesQuery = gql`
  query ZonesQuery {
    authClientZones {
      id
      clientId
      authPageId
      name
      interfaceName
      authTypes
      authLifetime
      sessionLifetime
      sessionTimeout
    }
  }
`

export const AuthPagesQuery = gql`
  ${AuthPageFragment}
  query MyAuthPagesQuery {
    myAuthPages {
      ...AuthPageFragment
    }
  }
`

export const CreateMyAuthPageMut = gql`
  ${AuthPageFragment}
  mutation CreateMyAuthPage($input: CreateMyAuthPageInput!) {
    createMyAuthPage(input: $input) {
      ...AuthPageFragment
    }
  }
`

export const UpdateMyAuthPageMut = gql`
  ${AuthPageFragment}
  mutation UpdateMyAuthPage($id: Float!, $input: UpdateAuthPageInput!) {
    updateMyAuthPage(id: $id, input: $input) {
      ...AuthPageFragment
    }
  }
`

export const DeleteMyAuthPageMut = gql`
  ${AuthPageFragment}
  mutation DeleteMyAuthPage($id: Float!) {
    deleteMyAuthPage(id: $id) {
      ...AuthPageFragment
    }
  }
`

export const GuestSessionFragment = gql`
  fragment GuestSessionFragment on GuestSession {
    id
    startedAt
    expiresAt
    expiredAt
    ip
    device {
      mac
    }
    auth {
      login
    }
  }
`

export const MyGuestSessionsQuery = gql`
  ${GuestSessionFragment}
  query MyGuestSessionsQuery($input: GuestSessionsInput!) {
    myGuestSessions(input: $input) {
      ...GuestSessionFragment
    }
  }
`

export const MyStatsOfConnectionsQuery = gql`
  query MyStatsOfConnectionsQuery($filter: MyStatsInput!) {
    myStatsOfConnections(filter: $filter) {
      key
      count
    }
  }
`
