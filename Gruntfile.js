const packageJSON = require('./package.json');

module.exports = (grunt) => {
  grunt.initConfig({
    'create-windows-installer': {
      // Currently only an ia32 (x86) build is offered.
      // This is what Github does with atom so it kinda makes sense :)
      ia32: {
        appDirectory: `dist/${packageJSON.productName}-win32-ia32`,
        outputDirectory: 'dist/win32',
        authors: packageJSON.author,
        exe: `${packageJSON.productName}.exe`,
        description: packageJSON.productName,
        title: packageJSON.productName,
        name: 'GPMDP_3',
        noMsi: true,
        certificateFile: '.cert.pfx',
        certificatePassword: process.env.SIGN_CERT_PASS,
        // DEV: When in master we should change this to point to github raw url
        iconUrl: 'https://www.samuelattard.com/img/gpmdp_setup.ico',
        setupIcon: 'build/assets/img/main.ico',
        // DEV: After initial 3.0.0 release this should be uncommented
        // TODO: Read DEV above ^^
        // remoteReleases: 'https://github.com/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-',
      },
    },
  });

  grunt.loadNpmTasks('grunt-electron-installer');

  grunt.registerTask('build:win32', ['create-windows-installer:ia32']);
  // grunt.registerTask('build:win64', ['create-windows-installer:x64']);
  grunt.registerTask('build:win', ['build:win32'/* , 'build:win64' */]);
};
