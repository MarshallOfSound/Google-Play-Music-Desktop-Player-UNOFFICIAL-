module.exports = (grunt) => {
  grunt.initConfig({
    'create-windows-installer': {
      // Currently only an ia32 (x86) build is offered.
      // This is what Github does with atom so it kinda makes sense :)
      // x64: {
      //   appDirectory: 'dist/Nucleus Player-win32-x64',
      //   outputDirectory: 'dist/build/installer64',
      //   authors: 'Samuel Attard',
      //   exe: 'Nucleus Player.exe',
      //   description: 'Nucleus Player',
      //   title: 'Nucleus Player',
      //   name: 'NucleusPlayer',
      //   noMsi: true,
      //   setupIcon: 'src/assets/icons/main.ico',
      //   certificateFile: '.cert.pfx',
      //   certificatePassword: process.env.NUCLEUS_CERT_PASS,
      // },
      ia32: {
        appDirectory: 'dist/Nucleus Player-win32-ia32',
        outputDirectory: 'dist/build/installer32',
        authors: 'Samuel Attard',
        exe: 'Nucleus Player.exe',
        description: 'Nucleus Player',
        title: 'Nucleus Player',
        name: 'NucleusPlayer',
        noMsi: true,
        setupIcon: 'src/assets/icons/main.ico',
        certificateFile: '.cert.pfx',
        certificatePassword: process.env.NUCLEUS_CERT_PASS,
        remoteReleases: 'https://github.com/Nucleus-Player/Nucleus-Player-Releases',
      },
    },
  });

  grunt.loadNpmTasks('grunt-electron-installer');

  grunt.registerTask('build:win32', ['create-windows-installer:ia32']);
  // grunt.registerTask('build:win64', ['create-windows-installer:x64']);
  grunt.registerTask('build:win', ['build:win32'/* , 'build:win64' */]);
};
