const Prism = require('markdown-it-prism')
// nuxtdown.config.js
module.exports = {
  content: [
    // My blog posts are in content/blog
    ['blog', {
      page: '/blog/article',
      permalink: '/blog/:slug',
      isPost: true
    }]],
  api: {
    baseURL: 'http://localhost:3000',
    browserBaseURL: 'http://localhost:3000'
  },
  markdown: {
    extend (config) {
      config.highlight = (code, lang) => {
        return `<pre><code class="language-${lang}">${Prism.highlight(code, Prism.languages[lang] || Prism.languages.markup)}</code></pre>`
      }
    }
  }
}
