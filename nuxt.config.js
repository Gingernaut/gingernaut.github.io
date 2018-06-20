module.exports = {
  fallback: true,
  subFolders: true,
  /*
  ** Headers of the page
  */
  head: {
    title: 'Tyler Peterson personal Website',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'main_description', name: 'description', content: `Tyler Peterson's personal website and blog` },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'twitter:card', content: 'Tyler Peterson' },
      { name: 'twitter:creator', content: '@gingernaut' },
      { hid: 'twitter_description', name: 'twitter:description', content: `Tyler Peterson's personal website, software engineer at Qualtrics in Seattle` },
      { hid: 'twitter_url', name: 'twitter:url', content: 'https://tylermarkpeterson.com' },
      { hid: 'og_url', name: 'og:url', content: 'https://tylermarkpeterson.com' },
      { name: 'og:type', content: 'website' },
      { hid: 'og_title', name: 'og:title', content: `Tyler Peterson's personal website and blog` },
      { hid: 'og_description', name: 'og:description', content: `Tyler Peterson's personal website, software engineer at Qualtrics in Seattle'` },
      { name: 'og:locale', content: 'en_US' },
      { name: 'author', content: 'Tyler Peterson' },
      // { hid: 'twitter_image', name: 'twitter:image', content: '*****default*****' },
      // { name: 'og:image', content: '*****default*****' },
      { name: 'theme-color', content: '#394053' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Crimson+Text|Muli' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#7e55f3' },
  modules: [
    'nuxtent',
    ['nuxt-sass-resources-loader', '@/assets/_global.scss']
  ],
  /*
  ** Build configuration
  */
  build: {
    extractCSS: true,
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  css: [
    'prismjs/themes/prism-okaidia.css'
  ],
  minify: {
    removeComments: true
  }
}
