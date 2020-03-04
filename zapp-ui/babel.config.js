module.exports = {
  presets: [
    [
      '@babel/env',
      {
        modules: false,
        useBuiltIns: 'usage'
      }
    ],
    '@babel/react'
  ],
  'plugins': [
    'babel-plugin-styled-components'
  ]
};
