
const path = require("path")

module.exports = {
    title: 'Tyler Peterson',
    description: 'Just playing around',
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
                itemPermaLink: "/:year/:month/:day/:slug",
              },
            ],
          },
      ],
  }
  