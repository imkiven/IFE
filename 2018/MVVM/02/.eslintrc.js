module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
      sourceType: 'module',
      ecmaVersion: 6,
      ecmaFeatures: {
        "jsx": false
      }
    },
    env: {
      browser: true,
    },
    extends: 'standard',
    // required to lint *.san files
    plugins: [
      'html'
    ],
    "settings": {
       "html/html-extensions": [".san"],  // consider .html files as XML
    },
    // add your custom rules here
    'rules': {
      // allow paren-less arrow functions
      'arrow-parens': 0,
      // allow async-await
      'generator-star-spacing': 0,
      // allow debugger during development
      'no-debugger': process.env.NODE_ENV === 'online' ? 2 : 0,
      //custom config
      'indent': ['error', 2],
      'space-before-function-paren': ['error', 'never'],
      'comma-dangle': ['error', 'only-multiline'],
      'key-spacing': ['error', { 'align': 'colon' }],
      'eol-last': 0,
      "semi": 0 // 分号
    }
  }