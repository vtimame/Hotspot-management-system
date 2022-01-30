import { AuthUserQuery } from '~/graphql/admin.graphql'

const userAuth = async ({ app, redirect, store }) => {
  const hasToken = !!app.$apolloHelpers.getToken()
  if (!hasToken) {
    return redirect('/')
  }

  try {
    const {
      data: { authUser },
    } = await app.apolloProvider.defaultClient.query({
      query: AuthUserQuery,
    })

    if (!Object.keys(authUser).length || authUser.__typename !== 'User') {
      await app.$apolloHelpers.onLogout()
      return redirect('/')
    }
  } catch (error) {
    console.log(error)
    return redirect('/')
  }
}

export default userAuth
