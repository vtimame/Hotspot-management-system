import gql from 'graphql-tag'

export const AuthPageFragment = gql`
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
    disabledAt
    zone {
      id
      name
      authTypes
    }
  }
`

export const AuthPagesQuery = gql`
  ${AuthPageFragment}
  query AuthPagesQuery($filter: AuthPageFilter!, $input: AuthPagesInput) {
    authPages(input: $input, filter: $filter) {
      ...AuthPageFragment
    }
  }
`

export const CreateAuthPageMut = gql`
  ${AuthPageFragment}
  mutation CreateAuthPageMut($input: CreateAuthPageInput!) {
    createAuthPage(input: $input) {
      ...AuthPageFragment
    }
  }
`

export const UpdateAuthPageMut = gql`
  ${AuthPageFragment}
  mutation UpdateAuthPage($id: Float!, $input: UpdateAuthPageInput!) {
    updateAuthPage(id: $id, input: $input) {
      ...AuthPageFragment
    }
  }
`

export const DeleteAuthPageMut = gql`
  ${AuthPageFragment}
  mutation DeleteAuthPage($id: Float!) {
    deleteAuthPage(id: $id) {
      ...AuthPageFragment
    }
  }
`

export const RestoreAuthPageMut = gql`
  ${AuthPageFragment}
  mutation RestoreAuthPage($id: Float!) {
    restoreAuthPage(id: $id) {
      ...AuthPageFragment
    }
  }
`

export const AuthPageAddedSub = gql`
  ${AuthPageFragment}
  subscription AuthPageAddedSub {
    authPageAdded {
      ...AuthPageFragment
    }
  }
`

export const AuthPageUpdatedSub = gql`
  ${AuthPageFragment}
  subscription AuthPageUpdatedSub {
    authPageUpdated {
      ...AuthPageFragment
    }
  }
`

export const AuthPageDeletedSub = gql`
  ${AuthPageFragment}
  subscription AuthPageDeletedSub {
    authPageDeleted {
      ...AuthPageFragment
    }
  }
`

export const AuthPageRestoredSub = gql`
  ${AuthPageFragment}
  subscription AuthPageRestoredSub {
    authPageRestored {
      ...AuthPageFragment
    }
  }
`
