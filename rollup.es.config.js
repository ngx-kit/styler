const globals = {
  "typescript": "ts",
  "@angular/core": "ng.core",
  "@angular/common": "ng.common",
  "@angular/platform-browser": "ng.platform-browser",
  "@angular/router": "ng.router"
};

export default {
  entry: './dist/styler.js',
  dest: './dist/module/styler.js',
  format: 'es',
  exports: 'named',
  external: Object.keys(globals),
  globals,
  onwarn: function(warning) {
    // Suppress this error message... there are hundreds of them. Angular team says to ignore it.
    // https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
    if (warning.code === 'THIS_IS_UNDEFINED') {
      return;
    }
    console.error(warning);
  }
};
