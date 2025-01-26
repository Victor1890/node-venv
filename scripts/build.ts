import { Generator } from 'npm-dts';
import { readFileSync, writeFileSync } from 'fs';
import { build } from 'bun';

new Generator({
  entry: 'src/index.ts',
  output: 'dist/index.d.ts',
}).generate();

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

await build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  minify: true,
  external: Object.keys(pkg.dependencies),
  target: 'node',
  format: 'esm',
});

// Update package.json to use the correct entry point
pkg.main = './dist/index.js';
writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
