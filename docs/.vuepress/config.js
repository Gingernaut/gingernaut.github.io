
const path = require("path")

module.exports = {
    title: 'Tyler Peterson',
    description: 'My personal website',
    theme: '@vuepress/theme-default',
    themeConfig: {
      // Please keep looking down to see the available options.
    },
    configureWebpack: {
        resolve: {
          alias: {
            '@assets': path.join(__dirname, "./docs/.vuepress/assets")
          }
        }
    },
    plugins: [
        '@vuepress/blog',
        {
            directories: [
              {
                // Unique ID of current classification
                id: 'post',
                // Target directory
                dirname: '_posts',
                // Path of the `entry page` (or `list page`)
                path: '/',
              },
            ],
          },
      ],
  }
  