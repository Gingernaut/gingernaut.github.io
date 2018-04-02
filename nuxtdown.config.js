// nuxtdown.config.js
module.exports = {
  content: [
    // My blog posts are in content/blog
    ['blog', {
      page: '/blog/article',
      permalink: '/blog/:slug',
      isPost: false
    }]],
  api: {
    baseURL: 'http://localhost:3000',
    browserBaseURL: 'https://tylermarkpeterson.com'
  }

}
