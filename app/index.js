'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var originUrl = require('git-remote-origin-url');

var MinGenerator = yeoman.generators.Base.extend({
    initializing: function () {
        this.pkg = require('../package.json');
    },

    prompting: function () {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(this.yeoman);
        this.log(chalk.cyan('You\'re installing ') + chalk.magenta('min,') + chalk.cyan(' the super-minimal static website template.'));

        var prompts = [{
            type: "input",
            name: 'projectName',
            message: 'What\'s the name of this project? (hit enter to use the folder name)',
            default: this.appname.split('-').join(' ').split('_').join(' ')
        },{
            type: "input",
            name: 'userName',
            message: 'What\'s your name?'
        },{
            type: "input",
            name: 'userEmail',
            message: '...and what\'s your email?'
        },{
            type: 'confirm',
            name: 'githubPages',
            message: 'Is this project uploading to Github pages?',
            default: true
        }];

        this.prompt(prompts, function(props) {
            this.projectName = props.projectName;
            this.userName = props.userName;
            this.userEmail = props.userEmail;
            var self = this;
            
            function checkOrigin() {
                originUrl('./', function(err, url){
                    self.log(url);
                    
                    if (err || !url) {
                        requestRepoName();
                    } else {
                        checkRepoName(url);
                    }
                })
            };
            
            function requestRepoName() {
                self.prompt({
                    type: "input",
                    name: 'githubPagesUrl',
                    message: 'What is your Github Pages address?'
                }, function(props){
                    var url = String(props.githubPagesUrl);
                    
                    if (url.slice(-4) !== '.git') {
                        url = url + '.git';
                    }
                    
                    if (url.indexOf('https://github.com/') !== -1 || url.indexOf('git@github.com:') !== -1) {
                        setGithubUrl(url);
                    } else {
                        setGithubUrl('git@github.com:' + url);
                    }
                        
                });
            };
            
            function checkRepoName(remoteUrl) {
                // Get the remote url of the repo
                if (remoteUrl.indexOf('http') !== -1) {
                    var protocol = 'git@github.com:';
                    var repoName = remoteUrl.split('.com/')[1];
                } else {
                    var protocol = 'https://github.com/';
                    var repoName = remoteUrl.split(':')[1];
                }
                
                repoName = String(repoName).split('.git')[0];

                // Ask if remote url is similar to github pages
                self.prompt({
                    type: 'confirm',
                    name: 'githubPages',
                    message: 'Is your Github Pages repo at ' + repoName + '.github.io ?',
                    default: true
                }, function(props){
                    if (props.githubPages){
                        setGithubUrl(protocol + repoName + '.github.io.git');
                    } else {
                        requestRepoName();
                    }
                });
            };
            
            function setGithubUrl(url) {
                self.githubPagesUrl = url;
                
                done();
            };
            
            if (props.githubPages) {
                checkOrigin();
            } else {
                setGithubUrl(false);
            }
            
            
        }.bind(this));
    },
    
    writing: function() {
        var source = this.sourceRoot();
        var destination = this.destinationRoot();
        var files = this.expandFiles('**', { dot: true, cwd: source });

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var src = path.join(source, file);
            
            if (path.basename(file).indexOf('_') == 0 && path.dirname(file).indexOf('sass/') === -1) {
                var dest = path.join(destination, path.dirname(file), path.basename(file).replace(/^_/, ''));
                this.template(src, dest);
            } else {
                var dest = path.join(destination, file);
                this.copy(src, dest);
            }
        }
    },

    install: function () {
        this.npmInstall();
    },
    
    end: function(){
        this.log(chalk.magenta('Thanks for installing! Run "grunt watch" to watch for changes to your app or sass and update as required.'));
    }
});

module.exports = MinGenerator;
