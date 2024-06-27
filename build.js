const { GasPlugin } = require('esbuild-gas-plugin')

const forProduction = process.argv.slice(2).includes('--release')

require('esbuild')
  .build({
    entryPoints: ['src/main.ts'],
    bundle: true,
    minify: forProduction,
    outfile: 'dist/main.js',
    plugins: [GasPlugin],
  })
  .catch(() => process.exit(1))
