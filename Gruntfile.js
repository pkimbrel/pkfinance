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
				src: 'src/<%= pkg.name %>.js',
				dest: 'dist/<%= pkg.name %>.min.js'
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
						'bower_components/bootstrap/dist/css/bootstrap-theme.min.css'
					],
					'dist/js/lib.js': [
						'bower_components/bootstrap/dist/js/bootstrap.min.js',
						'bower_components/jQuery/dist/jquery.min.js'
					]
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');

	// Default task(s).
	grunt.registerTask('default', ['clean', 'concat']);

};
