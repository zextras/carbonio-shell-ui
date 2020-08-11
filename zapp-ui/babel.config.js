module.exports = api => {
  const isTest = api.env('test');
  // You can use isTest to determine what presets and plugins to use.

  return {
    presets: [
      [
        '@babel/preset-env',
        isTest ? {
          targets: {
            node: 'current',
          }
        } : {
          'modules': false,
          'useBuiltIns': 'usage',
          'corejs': 3
        }
      ],
      '@babel/preset-react'
    ],
    plugins: [
      'babel-plugin-styled-components',
      ['@quickbaseoss/babel-plugin-styled-components-css-namespace', { 'cssNamespace': '&&&' }]
    ],
    babelrcRoots: isTest ? ['.'] : [
      '.',
      'src/__mocks__'
    ]
  };
};
