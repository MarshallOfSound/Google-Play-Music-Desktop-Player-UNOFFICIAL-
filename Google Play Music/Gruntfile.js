module.exports = function (grunt) {

    grunt.initConfig({
        copy: {
            "gmusic.js": {
                files: [{
                    expand: true,
                    cwd: 'node_modules/gmusic.js/dist',
                    src: '*.min.js',
                    dest: 'Resources/JS',
                }]
            },
            "gmusic-theme.js": {
                files: [{
                    expand: true,
                    cwd: 'node_modules/gmusic-theme.js/dist',
                    src: '*.min.js',
                    dest: 'Resources/JS'
                }]
            },
            "gmusic-mini-player.js": {
                files: [{
                    expand: true,
                    cwd: 'node_modules/gmusic-mini-player.js/dist',
                    src: '*.min.js',
                    dest: 'Resources/JS'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['copy']);

};