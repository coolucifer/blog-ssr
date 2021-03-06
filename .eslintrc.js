module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended',
    'airbnb-base'
  ],
  // add your custom rules here
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-plusplus': [
      process.env.NODE_ENV === 'production' ? 'error' : 'off',
      { allowForLoopAfterthoughts: true },
    ],
    'arrow-parens': [
      process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'as-needed',
    ],
    'max-len': ['warn', 200],
    'linebreak-style': ['off', 'windows'],
    'import/no-unresolved': ['off'],
    'import/no-extraneous-dependencies': ['off'],
    'vue/html-self-closing': ['off'],
    'vue/attributes-order': ['off'],
    'vue/singleline-html-element-content-newline': ['off'],
    'import/extensions': ['off'],
    'max-classes-per-file': ['off'],
    'no-shadow': ['off'],
    'no-param-reassign': ['off'],
  }
}
