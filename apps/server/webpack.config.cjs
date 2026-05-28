module.exports = (options) => {
  options.resolve = options.resolve ?? {};
  options.resolve.extensionAlias = {
    '.js': ['.ts', '.js'],
    '.mjs': ['.mts', '.mjs'],
    '.cjs': ['.cts', '.cjs'],
  };

  return options;
};
