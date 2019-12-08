const paths = {
  internalScripts: ['src/**/*.js'],
  html: 'src/public_html/**/*.html',
  less: 'src/assets/less/**/*.less',
  fonts: ['node_modules/materialize-css/dist/fonts/**/*',
          '!node_modules/materialize-css/dist/font/material-design-icons/*',
          'node_modules/material-design-icons-iconfont/dist/fonts/**/*'],
  images: ['src/assets/img/**/*', 'src/assets/icons/*'],
  locales: ['src/_locales/*.json'],
};

export {
  paths,
};
