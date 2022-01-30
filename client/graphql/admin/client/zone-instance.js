import gql from 'graphql-tag'

export const ZoneFragment = gql`
  fragment ZoneFragment on Zone {
    id
    clientId
    authPageId
    name
    interfaceName
    routerIp
    routerLogin
    routerPassword
    authTypes
    authLifetime
    sessionLifetime
    sessionTimeout
    createdAt
    updatedAt
    disabledAt
    client {
      id
      name
    }
  }
`

export const ZoneQuery = gql`
  ${ZoneFragment}
  query ZoneQuery($id: Float!, $input: ZoneQueryInput!) {
    zone(id: $id, input: $input) {
      ...ZoneFragment
    }
  }
`

export const UpdateZoneMut = gql`
  ${ZoneFragment}
  mutation UpdateZoneMut($id: Float!, $input: UpdateZoneInput!) {
    updateZone(id: $id, input: $input) {
      ...ZoneFragment
    }
  }
`

export const DeleteZoneMut = gql`
  ${ZoneFragment}
  mutation DeleteZoneMut($id: Float!) {
    disableZone(id: $id) {
      ...ZoneFragment
    }
  }
`

export const RestoreZoneMut = gql`
  ${ZoneFragment}
  mutation RestoreZoneMut($id: Float!) {
    restoreZone(id: $id) {
      ...ZoneFragment
    }
  }
`

export const ZoneUpdatedSub = gql`
  ${ZoneFragment}
  subscription ZoneUpdatedSub {
    zoneUpdated {
      ...ZoneFragment
    }
  }
`
