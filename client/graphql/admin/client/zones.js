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

export const ZonesQuery = gql`
  ${ZoneFragment}
  query ClientZones($input: ZonesInput, $filter: ZonesFilter) {
    zones(input: $input, filter: $filter) {
      ...ZoneFragment
    }
  }
`

export const CreateZoneMut = gql`
  ${ZoneFragment}
  mutation CreateClientZone($input: CreateZoneInput!) {
    createZone(input: $input) {
      ...ZoneFragment
    }
  }
`

export const UpdateZoneMut = gql`
  ${ZoneFragment}
  mutation UpdateClientZone($id: Float!, $input: UpdateZoneInput!) {
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

export const ZoneAddedSub = gql`
  ${ZoneFragment}
  subscription ZoneAddedSub {
    zoneAdded {
      ...ZoneFragment
    }
  }
`

export const ZoneUpdatedSub = gql`
  ${ZoneFragment}
  subscription ZoneUpdated {
    zoneUpdated {
      ...ZoneFragment
    }
  }
`
