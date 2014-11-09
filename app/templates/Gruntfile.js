module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-modernizr');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-newer');
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        browserify: {
            prod: {
                src: 'app/app.js',
                dest: 'app/build-<%= pkg.version %>.js',
                browserifyOptions: {
                    basedir: 'app/'
                }
            }
        }
        
        jshint: {
            gruntfile: {
                src: 'Gruntfile.js'
            },
            src: ['Gruntfile.js', 'app/**/*.js', '!app/build.js', '!app/lib/**/*']
        },
        
        sass: {
            dev: {
                files: {
                    'www/css/style.css': 'sass/style.scss'
                }
            },
            prod: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'www/css/style.css': 'sass/style.scss'
                }
            }
        },
        
        watch: {
            sass: {
                files: ['sass/**/*.scss'],
                tasks: ['sass:dev']
            },
            scripts: {
                files: ['app/**/*.js', '!app/build.js'],
                tasks: ['jshint', 'browserify']
            }
        },
        
        modernizr: {
            dist: {
                devFile: 'node_modules/bower/modernizr/modernizr.js',
                outputFile: 'www/app/lib/modernizr/modernizr-custom.js',
                
                extra: {
                    load: false
                },
                
                tests: ['csstransforms'],
                
                uglify: true,
                
                files: {
                    src: [
                        'www/app/**/*',
                        'sass/**/*'
                    ]
                }
            }
        },
        
        imagemin: {
            build: {
                options: {
                    optimizationLevel: 2
                },
                files: [{
                    expand: true,
                    cwd: 'www/img/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'www/img/'
                }]
            }
        },
        
        'gh-pages': {
            options: {
                base: 'www',
                branch: 'master',
                repo: 'git@github.com:URL-TO-REPO'
            },
            src: ['**/*', '!app/app.js']
        }
    });
    
    grunt.registerTask('default', ['modernizr', 'sass:prod', 'jshint', 'newer:imagemin', 'browserify', 'gh-pages']);
};
