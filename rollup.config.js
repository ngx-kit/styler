export default {
  entry: 'dist/package/index.js',
  dest: 'dist/package/bundle/ngx-kit-styler.umd.js',
  format: 'umd',
  exports: 'named',
  moduleName: 'ngx-kit-styler',
  globals: {
    'typescript': 'ts'
  }
};
