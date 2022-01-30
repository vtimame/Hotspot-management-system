import gql from 'graphql-tag'

const EventFragment = gql`
  fragment EventFragment on Event {
    id
    isDebugMessage
    message
    createdAt
    entities {
      clientId
      guestAttemptId
      guestAuthId
      guestDeviceId
      guestSessionId
      userId
      zoneId
      zonePageId
    }
  }
`

export const EventsQuery = gql`
  ${EventFragment}
  query EventsQuery($filter: EventsInput) {
    events(filter: $filter) {
      ...EventFragment
    }
  }
`

export const EventSub = gql`
  ${EventFragment}
  subscription EventsSub($filter: EventsInput) {
    eventAdded(filter: $filter) {
      ...EventFragment
    }
  }
`

export const LoginMut = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      jwt
      authEntity {
        __typename
      }
    }
  }
`
