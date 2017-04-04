module.exports = {
  ENV_COLOR: {
    development: 'bgGreen',
    production: 'bgCyan'
  },
  DLL_DIST: 'dll-dist',
  CONTEXT_REPLACE_REGEX: /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
  CONTEXT_REPLACE_REGEX2: /angular(\\|\/)core(\\|\/)@angular/
};
