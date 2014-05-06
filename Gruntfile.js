module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ['dist'],
        // Build Application JavaScript
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: [
                    'src/js/app.js',
                    'src/js/services.js',
                    'src/js/pages.js',
                    'src/modules/header.js',
                    'src/modules/sidebar.js',
                    'src/views/newTransaction.js',
                    'src/views/transactions.js',
                    'src/views/budget.js',
                    'src/views/planner.js'
                ],
                dest: 'dist/app/js/<%= pkg.name %>.min.js'
            }
        },
        // Build Application CSS
        cssmin: {
            minify: {
                src: "src/**/*.css",
                dest: "dist/app/css/<%= pkg.name %>.min.css"
            }
        },
        // Process Application Dependencies (CSS and JavaScript)
        concat: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            dist: {
                files: {
                    'dist/app/css/lib.min.css': [
                    'bower_components/bootstrap/dist/css/bootstrap.min.css',
                    'bower_components/bootstrap/dist/css/bootstrap-theme.min.css',
                    'bower_components/angular-xeditable/dist/css/xeditable.css'
                ],
                    'dist/app/js/lib.min.js': [
                    'bower_components/jquery/dist/jquery.min.js',
                    'bower_components/bootstrap/dist/js/bootstrap.min.js',
                    'bower_components/moment/min/moment.min.js',
                    'bower_components/typeahead.js/dist/typeahead.jquery.js',
                    'bower_components/angular/angular.min.js',
                    'bower_components/angular-cookies/angular-cookies.min.js',
                    'bower_components/angular-ui-router/release/angular-ui-router.min.js',
                    'bower_components/angular-xeditable/dist/js/xeditable.min.js'
                    ]
                }
            }
        },
        // Copy Static Content
        copy: {
            fonts: {
                expand: true,
                cwd: 'bower_components/bootstrap/dist/fonts/',
                src: '**',
                dest: 'dist/app/fonts/',
                flatten: true,
                filter: 'isFile'
            },
            ico: {
                expand: true,
                cwd: 'src/ico/',
                src: '**',
                dest: 'dist/app/ico'
            },
            html_main: {
                expand: true,
                cwd: 'src/',
                src: '*.html',
                dest: 'dist/app'
            },
            html_modules: {
                expand: true,
                cwd: 'src/modules',
                src: '*.html',
                dest: 'dist/app/modules'
            },
            html_pages: {
                expand: true,
                cwd: 'src/pages',
                src: '*.html',
                dest: 'dist/app/pages'
            },
            html_views: {
                expand: true,
                cwd: 'src/views/',
                src: '*.html',
                dest: 'dist/app/views'
            }
        },
        // Build Application Configuration
        ngconstant: {
            options: {
                name: 'pkfinance',
                dest: 'dist/app/js/config.js',
                wrap: 'var pkfinance = {%= __ngModule %}',
                constants: {
                    'DATA_FOLDER': 'http://pkf-staging-em2cmvmpms.elasticbeanstalk.com/service/',
                    'DIST_FOLDER': '',
                    'START_DATE': '2014-01-11'
                },
                deps: ['ngCookies', 'ui.router', 'xeditable']
            },
            build: {}
        },
        // Copy Static Content to S3
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
                        src: 'dist/app/**/*.*',
                        dest: '/',
                        rel: 'dist/app'
                    },
                    {
                        src: 'test/data/**/*.*',
                        dest: '/',
                        rel: 'test'
                    }
                ]
            },
            production: {
                options: {
                    bucket: 'finances.paulkimbrel.com'
                },
                upload: [
                    {
                        src: 'dist/app/**/*.*',
                        dest: '/'
                    }
                ]
            },
            location: {
                options: {
                    bucket: 'staging.finance.paulkimbrel.com'
                },
                upload: [
                    {
                        src: 'test/location.*',
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
