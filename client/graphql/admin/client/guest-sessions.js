import gql from 'graphql-tag'

export const GuestSessionFragment = gql`
  fragment GuestSessionFragment on GuestSession {
    id
    zoneId
    deviceId
    authId
    ip
    startedAt
    expiresAt
    expiredAt
    auth {
      id
      login
      startedAt
      expiresAt
      expiredAt
    }
    device {
      id
      mac
      userAgent
      createdAt
      ua {
        browser {
          name
          version
        }
        engine {
          name
          version
        }
        os {
          name
          version
        }
        device {
          model
          type
          vendor
        }
        cpu {
          architecture
        }
      }
    }
    radiusCredentials {
      username
      value
    }
    radiusExpiration {
      value
    }
  }
`

export const GuestSessionsQuery = gql`
  ${GuestSessionFragment}
  query GuestSessionQuery($filter: GuestSessionsInput!) {
    guestSessions(filter: $filter) {
      ...GuestSessionFragment
    }
  }
`

export const GuestSessionDisabled = gql`
  ${GuestSessionFragment}
  subscription GuestSessionDisabled($zoneId: Float!) {
    guestSessionDisabled(zoneId: $zoneId) {
      ...GuestSessionFragment
    }
  }
`

export const GuestSessionAdded = gql`
  ${GuestSessionFragment}
  subscription GuestSessionAdded($zoneId: Float!) {
    guestSessionAdded(zoneId: $zoneId) {
      ...GuestSessionFragment
    }
  }
`

export const DropGuestSession = gql`
  mutation DropGuestSession($id: Float!) {
    dropGuestSession(id: $id)
  }
`

export const DropGuestAuth = gql`
  mutation DropGuestAuth($id: Float!) {
    dropGuestAuth(id: $id)
  }
`
