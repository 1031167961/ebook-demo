module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    indent: 'off',
    'space-before-function-paren': 'off',
    'prefer-const': 'off',
    'no-multiple-empty-lines': 'off',
    'quote-props': 'off',
    'object-curly-spacing': 'off',
    'keyword-spacing': 'off',
    'no-prototype-builtins': 'off',
    'no-unused-vars': 'off'
  }
}
