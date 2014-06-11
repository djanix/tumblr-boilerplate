module.exports = function (grunt) {
    require('matchdep').filterDev('grunt-*').forEach(
        grunt.loadNpmTasks
    );

    var config = {
        basePath: 'app',
        jsSrc: 'app/assets/js/src',
        jsDest: 'app/assets/js/dest',
        cssSrc: 'app/assets/css/src',
        cssDest: 'app/assets/css/dest'
    };

    grunt.initConfig({
        config: config,
        pkg: grunt.file.readJSON('package.json'),
        banner: '/* <%= pkg.name %> - <%= pkg.version %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy-mm-dd") %> <%= pkg.author.name %> - <%= pkg.author.url %> */\n\n',
        autoprefixer: {
            single_file: {
                options: {
                    browsers: ['last 3 version', '> 1%', 'ie 8']
                },
                src: '<%= config.cssDest %>/main.css',
                dest: '<%= config.cssDest %>/main.css'
            }
        },
        csswring: {
            min: {
                src: '<%= config.cssDest %>/main.css',
                dest: '<%= config.cssDest %>/main.css'
            }
        },
        htmlbuild: {
            dist: {
                src: '<%= config.basePath %>/index.html',
                dest: '<%= config.basePath %>/index_compiled.html',
                options: {
                    scripts: {
                        inlineScripts: '<%= config.jsDest %>/main.min.js'
                    },
                    styles: {
                        inlineCss: '<%= config.cssDest %>/main.css'
                    },
                    sections: {
                        layout: {
                            header: '<%= config.basePath %>/templates/header.html',
                            posts: '<%= config.basePath %>/templates/posts.html',
                            footer: '<%= config.basePath %>/templates/footer.html'
                        }
                    }
                }
            }
        },
        replace: {
            'scss_import_path': {
                src: ['<%= config.cssDest %>/main.scss'],
                overwrite: true,
                replacements: [
                    {
                        from: /\\/g,
                        to: '/'
                    }
                ]
            }
        },
        sass: {
            dist: {
                files: [
                    {
                        src: '<%= config.cssDest %>/main.scss',
                        dest: '<%= config.cssDest %>/main.css'
                    }
                ]
            }
        },
        sass_imports: {
            imports: {
                src: ['<%= config.cssSrc %>/helpers/vars.scss', '<%= config.cssSrc %>/helpers/*.scss', '<%= config.cssSrc %>/**/*.scss'],
                dest: '<%= config.cssDest %>/main.scss'
            }
        },
        uglify: {
            my_target: {
                files: [{
                    src: '<%= config.jsSrc %>/**/*.js',
                    dest: '<%= config.jsDest %>/main.min.js'
                }]
            }
        },
        watch: {
            js: {
                files: ["<%= config.jsSrc %>/**/*.js"],
                tasks: ['build:js', 'build:html']
            },
            sass: {
                files: ["<%= config.cssSrc %>/**/*.scss"],
                tasks: ['build:css', 'build:html']
            },
            html: {
                files: ["<%= config.basePath %>/index.html", "<%= config.basePath %>/templates/*.html"],
                tasks: ['build:html']
            },
            options: {
                spawn: true
            }
        }
    });

    grunt.registerTask('default', ['build', 'watch']);

    grunt.registerTask('build', ['build:css', 'build:js', 'build:html']);
    grunt.registerTask('build:css', ['sass_imports', 'replace:scss_import_path', 'sass', 'autoprefixer', 'csswring']);
    grunt.registerTask('build:js', ['uglify']);
    grunt.registerTask('build:html', ['htmlbuild']);
};