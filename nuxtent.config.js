
const Prism = require('prismjs')
const loadLanguages = require('prismjs/components/index.js')
const externalLinks = require('markdown-it-link-attributes')
const emoji = require('markdown-it-emoji')
loadLanguages(['python', 'bash'])

module.exports = {
  content: [
    // Blog posts are in content/blog
    ['blog', {
      page: '/blog/_article',
      permalink: '/blog/:year/:slug',
      isPost: true,
      generate: [
        'get',
        'getAll'
      ]
    }]],
  api: (isStatic) => {
    return {
      baseURL: 'http://localhost:3000',
      browserBaseURL: isStatic ? 'https://tylermpeterson.com' : 'http://localhost:3000'
    }
  },
  parsers: {
    md: {
      extend (config) {
        config.highlight = (code, lang) => {
          return `<pre class="language-${lang}"><code class="language-${lang}">${Prism.highlight(code, Prism.languages[lang] || Prism.languages.markup)}</code></pre>`
        }
      },
      plugins: [
        emoji,
        [externalLinks, { target: '_blank', rel: 'noopener' }]
      ]
    }
  }
}
