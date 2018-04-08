
const Prism = require('prismjs')

module.exports = {
  content: [
    // My blog posts are in content/blog
    ['blog', {
      page: '/blog/my-article',
      permalink: '/blog/:slug',
      isPost: true,
      generate: [
        'get',
        'getAll'
      ]
    }]],
  api: {
    baseURL: 'http://localhost:3000',
    browserBaseURL: 'http://localhost:3000'
  },
  md: {
    extend (config) {
      config.highlight = (code, lang) => {
        return `<pre class="language-${lang}"><code class="language-${lang}">${Prism.highlight(code, Prism.languages[lang], Prism.languages[lang])}</code></pre>`
      }
    }
  }
}
