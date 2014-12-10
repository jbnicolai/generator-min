// Generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>

module.exports = function(grunt) {
    'use strict';
    
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-modernizr');
    grunt.loadNpmTasks('grunt-contrib-imagemin');<% if (githubPagesUrl) { %>
    grunt.loadNpmTasks('grunt-gh-pages');<% } %>
    grunt.loadNpmTasks('grunt-newer');
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        browserify: {
            prod: {
                src: 'www/app/app.js',
                dest: 'www/app/build.js',
                options: {
                    //alias: 'path-to-script.js:script-shortname',
                    browserifyOptions: {
                       basedir: './node_modules/'    
                    }
                }
            }
        },
        
        jshint: {
            src: ['Gruntfile.js', 'www/app/**/*.js', '!www/app/build.js']
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
                files: ['www/app/**/*.js', '!www/app/build.js'],
                tasks: ['jshint', 'browserify']
            }
        },
        
        modernizr: {
            dist: {
                devFile: 'www/modernizr-latest.js',
                outputFile: 'www/modernizr-custom.js',
                
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
        }<% if (githubPagesUrl) { %>,
        
        'gh-pages': {
            options: {
                base: 'www',
                branch: 'master',
                repo: '<%= githubPagesUrl %>'
            },
            src: ['**/*', '!app/**/*.js']
        } <% } %>
    });
    
    grunt.registerTask('default', ['modernizr', 'sass:prod', 'jshint', 'newer:imagemin', 'browserify'<% if (githubPagesUrl) { %>, 'gh-pages'<% } %>]);
};
