import gql from 'graphql-tag'

export const ClientEmployeeFragment = gql`
  fragment ClientEmployeeFragment on ClientEmployee {
    id
    clientId
    name
    surname
    patronymic
    email
    phoneNumber
    createdAt
    updatedAt
    disabledAt
    company {
      id
      name
    }
  }
`
  
export const ClientEmployeesQuery = gql`
  ${ClientEmployeeFragment}
  query ClientEmployees($input: ClientEmployeesInput!) {
    clientEmployees(input: $input) {
      ...ClientEmployeeFragment
    }
  }
`

export const CreateClientEmployeeMut = gql`
  ${ClientEmployeeFragment}
  mutation CreateClientEmployee($input: CreateClientEmployeeInput!) {
    createClientEmployee(input: $input) {
      ...ClientEmployeeFragment
    }
  }
`

export const UpdateClientEmployeeMut = gql`
  ${ClientEmployeeFragment}
  mutation UpdateClientEmployee($id: Float!, $input: UpdateClientEmployeeInput!) {
    updateClientEmployee(id: $id, input: $input) {
      ...ClientEmployeeFragment
    }
  }
`

export const DeleteClientEmployeeMut = gql`
  ${ClientEmployeeFragment}
  mutation DeleteClientEmployeeMut($id: Float!) {
    disableClientEmployee(id: $id) {
      ...ClientEmployeeFragment
    }
  }
`

export const RestoreClientEmployeeMut = gql`
  ${ClientEmployeeFragment}
  mutation RestoreClientEmployeeMut($id: Float!) {
    restoreClientEmployee(id: $id) {
      ...ClientEmployeeFragment
    }
  }
`
