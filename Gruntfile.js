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
                    'src/views/editSettings.js',
                    'src/views/editCategories.js',
                    'src/views/editTypeahead.js',
                    'src/views/editFixedEvents.js',
                    'src/views/summary.js',
                    'src/views/transactions.js',
                    'src/views/budget.js',
                    'src/views/planner.js'
                ],
                dest: 'dist/js/<%= pkg.name %>.min.js'
            }
        },
        // Build Application CSS
        cssmin: {
            minify: {
                src: "src/**/*.css",
                dest: "dist/css/<%= pkg.name %>.min.css"
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
                    'dist/css/lib.min.css': [
                    'bower_components/bootstrap/dist/css/bootstrap.min.css',
                    'bower_components/bootstrap/dist/css/bootstrap-theme.min.css',
                    'bower_components/angular-xeditable/dist/css/xeditable.css'
                ],
                    'dist/js/lib.min.js': [
                    'bower_components/jquery/dist/jquery.min.js',
                    'bower_components/bootstrap/dist/js/bootstrap.min.js',
                    'bower_components/moment/min/moment.min.js',
                    'bower_components/typeahead.js/dist/typeahead.jquery.js',
                    'bower_components/angular/angular.min.js',
                    'bower_components/angular-animate/angular-animate.min.js',
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
                dest: 'dist/fonts/',
                flatten: true,
                filter: 'isFile'
            },
            ico: {
                expand: true,
                cwd: 'src/ico/',
                src: '**',
                dest: 'dist/ico'
            },
            img: {
                expand: true,
                cwd: 'src/css/img',
                src: '**',
                dest: 'dist/css/img'
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
            html_pages: {
                expand: true,
                cwd: 'src/pages',
                src: '*.html',
                dest: 'dist/pages'
            },
            html_views: {
                expand: true,
                cwd: 'src/views/',
                src: '*.html',
                dest: 'dist/views'
            },
            service: {
                expand: true,
                cwd: 'src/php/',
                src: '**/*',
                dest: 'dist/service'
            },
            htaccess: {
                expand: true,
                cwd: 'src/php/',
                src: '.htaccess',
                dest: 'dist/service'
            }
        },
        // Build Application Configuration
        ngconstant: {
            options: {
                name: 'pkfinance',
                dest: 'dist/js/config.js',
                wrap: 'var pkfinance = {%= __ngModule %}',
                deps: ['ui.router', 'xeditable', 'ngAnimate']
            },
            staging: {
                constants: {
                    'ACCOUNTS_AVAILABLE': ['First Bank'],
                    'DATA_FOLDER': 'http://162.243.83.90/service/',
                    'DIST_FOLDER': ''
                }
            },
            production: {
                constants: {
                    'ACCOUNTS_AVAILABLE': ['State Farm', 'PNC'],
                    'DATA_FOLDER': '/service/',
                    'DIST_FOLDER': ''
                }
            }
        },
        // Copy Static Content to S3
        rsync: {
            options: {
                args: ["--verbose"],
                include: ['"service/.htaccess"'],
                archive: true,
                recursive: true,
            },
            staging: {
                options: {
                    src: "./dist/./",
                    dest: "/var/www/html/.",
                    host: "pkimbrel@162.243.83.90",
                    syncDestIgnoreExcl: true
                }
            },
            "staging-data": {
                options: {
                    chown: "pkimbrel:www-data",
                    src: "./test/data",
                    dest: "/var/www/test",
                    host: "pkimbrel@162.243.83.90",
                    syncDestIgnoreExcl: true
                }
            },
            production: {
                options: {
                    src: "./dist/./",
                    dest: "/var/www/html/.",
                    host: "pkimbrel@104.131.34.91",
                    syncDestIgnoreExcl: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-ng-constant');
    grunt.loadNpmTasks('grunt-rsync');
    grunt.loadNpmTasks('grunt-scp');

    // Default task(s).
    grunt.registerTask('default', ['clean', 'concat', 'uglify', 'cssmin', 'copy', 'ngconstant:staging']);
    grunt.registerTask('stage', ['default', 'ngconstant:staging', 'rsync:staging']);
    grunt.registerTask('production', ['default', 'ngconstant:production', 'rsync:production']);

};
