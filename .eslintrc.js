module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    ecmaVersion: 2017
  },
  env: {
    browser: true,
    node: true
  },

  plugins: [
    'html',
    'vue'
  ],
  extends: [
    'eslint:recommended', 
    'standard', 
    'plugin:vue/strongly-recommended'
  ],

  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // console log statements
    'no-console': 1,
    // indentation
    'indent': [2, 2],
    // triple equality
    'eqeqeq': 1,
    // var instead of let
    'no-var': 2,
    // string quotes
    'quotes': ['warn', 'single', {'allowTemplateLiterals': true}]
  }
};