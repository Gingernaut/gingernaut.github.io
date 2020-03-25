
const path = require("path")
const fs = require("fs")

module.exports = {
    title: 'Tyler Peterson',
    description: 'My personal website',
    theme: '@vuepress/theme-default',
    themeConfig: {
      navbar: false // default vue one, instead use own component
    },
    configureWebpack: {
        resolve: {
          alias: {
            '@assets': path.join(__dirname, "./assets"),
            '@': path.join(__dirname, "./")
          }
        },
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
                // Path of the `entry page` (or `list page`)g
                path: '/',
              },
            ],
          },
      ],
  }
  