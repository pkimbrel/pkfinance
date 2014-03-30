console.log(process.env);
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ['dist'],
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'test/**/*.js',
                dest: 'dist/js/<%= pkg.name %>.min.js'
            }
        },
        cssmin: {
            minify: {
                src: "src/**/*.css",
                dest: "dist/css/<%= pkg.name %>.min.css"
            }
        },
        concat: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            dist: {
                files: {
                    'dist/css/lib.min.css': [
                        'bower_components/bootstrap/dist/css/bootstrap.min.css',
                        'bower_components/bootstrap/dist/css/bootstrap-theme.min.css',
                        'bower_components/x-editable/dist/bootstrap3-editable/css/bootstrap-editable.css'
                    ],
                    'dist/js/lib.min.js': [
                        'bower_components/jquery/dist/jquery.min.js',
                        'bower_components/bootstrap/dist/js/bootstrap.min.js',
                        'bower_components/moment/min/moment.min.js',
                        'bower_components/x-editable/dist/bootstrap3-editable/js/bootstrap-editable.min.js'
                    ]
                }
            }
        },
        copy: {
            fonts: {
                expand: true,
                cwd: 'bower_components/bootstrap/dist/fonts/',
                src: '**',
                dest: 'dist/fonts/',
                flatten: true,
                filter: 'isFile'
            },
            html: {
                expand: true,
                cwd: 'src/html/',
                src: '*.html',
                dest: 'dist/'
            }
        },
        s3: {
            options: {
                key: process.env.AWS_ACCESS_KEY_ID,
                secret: process.env.AWS_SECRET_ACCESS_KEY,
                access: 'public-read'
            },
            staging: {
                options: {
                    bucket: 'staging.finance.paulkimbrel.com'
                },
                upload: [
                    {
                        src: 'dist/**/*.*',
                        dest: '/',
                        rel: 'dist'
                    }
                ]
            },
            production: {
                options: {
                    bucket: 'finances.paulkimbrel.com'
                },
                upload: [
                    {
                        src: 'dist/**/*.*',
                        dest: '/'
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-s3');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('default', ['clean', 'concat', 'uglify', 'cssmin', 'copy']);
    grunt.registerTask('stage', ['default', 's3:staging']);

};
