import { AuthUserQuery } from '~/graphql/admin.graphql'
import { ClientQuery } from '~/graphql/client.graphql'

const guest = async ({ app, redirect }) => {
  const hasToken = !!app.$apolloHelpers.getToken()
  if (hasToken) {
    let userError = false
    let clientError = false

    try {
      await app.apolloProvider.defaultClient.query({
        query: AuthUserQuery,
      })
    } catch (error) {
      console.log(error)
      userError = true
    }

    try {
      await app.apolloProvider.defaultClient.query({
        query: ClientQuery,
      })
    } catch (error) {
      clientError = true
    }

    if (!userError) return redirect({ name: 'admin-dashboard' })
    if (!clientError) return redirect({ name: 'client' })
  }
}

export default guest
