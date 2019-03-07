import typescript from 'rollup-plugin-typescript3';

export default [
  {
    input: 'src/main.ts',
    output: {
      file: 'dist/web-extension/main.js',
      format: 'es'
    },
    plugins: [
      typescript()
    ]
  },
  {
    input: 'src/options.ts',
    output: {
      file: 'dist/web-extension/options.js',
      format: 'iife'
    },
    plugins: [
      typescript()
    ]
  }
]
