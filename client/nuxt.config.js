require('dotenv').config()

export default {
  server: {
    port: Number(process.env.APP_PORT),
  },
  layoutTransition: {
    name: 'page',
    mode: 'out-in',
  },
  pageTransition: {
    name: 'page',
    mode: 'out-in',
  },
  head: {
    title: process.env.APP_NAME,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'msapplication-TitleColor', content: '#da532c' },
      { name: 'theme-color', content: '#ffffff' },
    ],
    link: [
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/favicon/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/favicon/site.webmanifest' },
    ],
  },
  loading: false,
  css: [
    'ant-design-vue/dist/antd.css',
    'bootstrap/dist/css/bootstrap-grid.css',
    'css.gg/icons/all.css',
    '~/assets/scss/_transitions.scss',
    '~/assets/scss/ant.scss',
  ],
  plugins: ['@/plugins/antd-ui', '@/plugins/vuelidate'],
  components: true,
  buildModules: ['@nuxtjs/dotenv', '@nuxtjs/color-mode'],
  modules: ['@nuxtjs/pwa', '@nuxtjs/apollo', '@nuxtjs/axios'],
  axios: {
    baseURL: `${process.env.API_PROTO}://${process.env.API_HOST}/rest`,
  },
  pwa: {
    manifest: {
      lang: 'ru',
    },
  },
  colorMode: {
    preference: 'light',
  },
  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: `${process.env.API_PROTO}://${process.env.API_HOST}/${process.env.GRAPHQL_ENDPOINT}`,
        wsEndpoint: `${process.env.GRAPHQL_SUBSCRIPTIONS_PROTO}://${process.env.API_HOST}/${process.env.GRAPHQL_SUBSCRIPTIONS_ENDPOINT}`,
        errorHandler: '~/plugins/apollo-error-handler.js',
      },
    },
    defaultOptions: {
      $query: {
        fetchPolicy: 'network-only',
      },
    },
  },
  build: {},
}
