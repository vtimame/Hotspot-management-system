import { ClientQuery } from '~/graphql/client.graphql'

const clientAuth = async ({ app, redirect }) => {
  const hasToken = !!app.$apolloHelpers.getToken()
  if (!hasToken) {
    return redirect('/')
  }

  try {
    const {
      data: { authClient },
    } = await app.apolloProvider.defaultClient.query({
      query: ClientQuery,
    })

    if (
      !Object.keys(authClient).length ||
      authClient.__typename !== 'ClientEmployee'
    ) {
      await app.$apolloHelpers.onLogout()
      return redirect('/')
    }
  } catch (error) {
    console.log(error)
    return redirect('/')
  }
}

export default clientAuth
