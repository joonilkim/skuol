module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module',
    parser: 'babel-eslint',
    ecmaVersion: 2018
  },
  env: {
    browser: true,
  },
  rules: {
    'generator-star-spacing': 'off',
    'space-before-function-paren': 'off',
    'padded-blocks': 'off',
    'space-before-blocks': 'off',
    'curly': 'off',
    'no-multi-spaces': 'off',
    'no-multiple-empty-lines': 'off',
    'spaced-comment': 'off',
    'keyword-spacing': 'off',
    'space-infix-ops': 'off',
    'space-in-parens': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
