
const path = require("path")
const fs = require("fs")

module.exports = {
    title: 'Tyler Peterson',
    description: 'My personal website',
    theme: '@vuepress/theme-default',
    themeConfig: {
      navbar: false, // default vue one, instead use own component
    },
    configureWebpack: {
        resolve: {
          alias: {
            '@assets': path.join(__dirname, "./assets"),
            '@': path.join(__dirname, "./")
          }
        },
    },
    permalink: '/blog/:year/:month/:day/:slug',
  }
  