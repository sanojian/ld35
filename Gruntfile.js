/**
 * Created by jonas on 2016-04-16.
 */

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({

		// grunt-express will serve the files from the folders listed in `bases`
		// on specified `port` and `hostname`
		develop: {
			server: {
				file: './server/ld35server.js'
			}
		},
		watch: {
			scripts: {
				files: [
					'client/src/**/*'
				],
				tasks: ['jshint','concat']
			}
		},
		jshint: {
			options: {
				evil: true
			},
			all: ['client/src/**/*.js', 'server/**/*.js']
		},
		copy: {
			files: {
				cwd: 'client/src/assets',     // set working folder / root to copy
				src: '**/*',           // copy all files and subfolders
				dest: 'client/dist/assets',    // destination folder
				expand: true           // required when using cwd
			}
		},
		concat: {
			basic_and_extras: {
				files: {
					'client/dist/index.html': ['client/src/index.html'],
					'client/dist/ld35client.js': [
						'client/src/js/DEFS.js',
						'client/src/js/game_init.js',
						'client/src/js/*.js'
					]
				}
			}
		}

	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-develop');

	grunt.registerTask('server', [
		'develop:server',
		'watch'
	]);
	grunt.registerTask('build', ['jshint', 'copy', 'concat']);
	grunt.registerTask('default', ['build','server']);
	grunt.registerTask('heroku:development', 'build');

};
