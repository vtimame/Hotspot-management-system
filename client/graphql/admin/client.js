import gql from 'graphql-tag'

export const ClientFragment = gql`
  fragment ClientFragment on Client {
    id
    name
    createdAt
    updatedAt
    disabledAt
  }
`

export const ClientQuery = gql`
  ${ClientFragment}
  query ClientInstance($id: Float!, $input: ClientInput) {
    client(id: $id, input: $input) {
      ...ClientFragment
    }
  }
`

export const ClientsQuery = gql`
  ${ClientFragment}
  query ClientsQuery($input: ClientsInput) {
    clients(input: $input) {
      ...ClientFragment
    }
  }
`

export const CreateClientMut = gql`
  ${ClientFragment}
  mutation CreateClientMut($input: CreateClientInput!) {
    createClient(input: $input) {
      ...ClientFragment
    }
  }
`

export const UpdateClientMut = gql`
  ${ClientFragment}
  mutation UpdateClientMut($id: Float!, $input: UpdateClientInput!) {
    updateClient(id: $id, input: $input) {
      ...ClientFragment
    }
  }
`

export const DeleteClientMut = gql`
  ${ClientFragment}
  mutation DeleteClientMut($id: Float!) {
    disableClient(id: $id) {
      ...ClientFragment
    }
  }
`

export const RestoreClientMut = gql`
  ${ClientFragment}
  mutation RestoreClientMut($id: Float!) {
    restoreClient(id: $id) {
      ...ClientFragment
    }
  }
`

export const ClientAddedSub = gql`
  ${ClientFragment}
  subscription ClientAddedSub {
    clientAdded {
      ...ClientFragment
    }
  }
`

export const ClientUpdatedSub = gql`
  ${ClientFragment}
  subscription AsideSectionClientUpdateSub {
    clientUpdated {
      ...ClientFragment
    }
  }
`

export const LoginAsClientMut = gql`
  mutation LoginAsClientMut($id: Float!) {
    loginAsClient(id: $id) {
      jwt
      authEntity {
        __typename
      }
    }
  }
`
