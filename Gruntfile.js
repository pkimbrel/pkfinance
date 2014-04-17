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
                src: [
                    'src/js/app.js',
                    'src/js/services.js',
                    'src/modules/header.js',
                    'src/modules/sidebar.js',
                    'src/modules/transactionForm.js',
                    'src/modules/transactions.js',
                    'src/modules/budget.js',
                    'src/modules/planner.js',
                    'src/js/services.js',
                    'src/js/views.js'
                ],
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
                    'bower_components/angular-xeditable/dist/css/xeditable.css'
                ],
                    'dist/js/lib.min.js': [
                    'bower_components/jquery/dist/jquery.min.js',
                    'bower_components/bootstrap/dist/js/bootstrap.min.js',
                    'bower_components/moment/min/moment.min.js',
                    'bower_components/angular/angular.min.js',
                    'bower_components/angular-cookies/angular-cookies.min.js',
                    'bower_components/angular-ui-router/release/angular-ui-router.min.js',
                    'bower_components/angular-xeditable/dist/js/xeditable.min.js'
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
            data: {
                expand: true,
                cwd: 'src/data/',
                src: '**',
                dest: 'dist/data'
            },
            ico: {
                expand: true,
                cwd: 'src/ico/',
                src: '**',
                dest: 'dist/ico'
            },
            html_main: {
                expand: true,
                cwd: 'src/',
                src: '*.html',
                dest: 'dist'
            },
            html_modules: {
                expand: true,
                cwd: 'src/modules',
                src: '*.html',
                dest: 'dist/modules'
            },
            html_views: {
                expand: true,
                cwd: 'src/views/',
                src: '*.html',
                dest: 'dist/views'
            }
        },
        ngconstant: {
            options: {
                name: 'pkfinance',
                dest: 'dist/js/config.js',
                wrap: 'var pkfinance = {%= __ngModule %}',
                constants: {
                    'DATA_FOLDER': 'data',
                    'START_DATE': '2014-01-11'
                },
                deps: ['ngCookies', 'ui.router', 'xeditable']
            },
            build: {}
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
    grunt.loadNpmTasks('grunt-ng-constant');

    // Default task(s).
    grunt.registerTask('default', ['clean', 'concat', 'uglify', 'cssmin', 'copy', 'ngconstant:build']);
    grunt.registerTask('stage', ['default', 's3:staging']);

};
