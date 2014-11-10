'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var originUrl = require('git-remote-origin-url');

var MinGenerator = generators.Base.extend({
    initializing: function () {
        this.pkg = require('../package.json');
    },

    prompting: function () {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(this.yeoman);
        this.log(chalk.cyan('You\'re installing "min", the super-minimal static website template.'));

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

        this.prompt(prompts, function (props) {
            this.projectName = props.projectName;
            this.userName = props.userName;
            this.userEmail = props.userEmail;
            
            var checkOrigin = function(){
                originUrl('./', function(err, url){
                    if (err) return false;
                    
                    return url;
                })
            };
            
            var checkRepoName = function(remoteUrl){
                // Get the remote url of the repo
                var repoName = (remoteUrl.indexOf('http') !== -1) ?
                    remoteUrl.split('.com/')[1]
                    : remoteUrl.split(':')[1];

                repoName.split('.git')[0];

                // Ask if remote url is similar to github pages
                this.prompt({
                    type: 'confirm',
                    name: 'githubPages',
                    message: 'Is your Github Pages repo at ' + repoName + '.github.io ?',
                    default: true
                }, function(props){
                    if (props.githubPages){
                        this.githubPagesUrl = repoName + '.github.io.git';
                    } else {
                        requestRepoName().bind(this);
                    }
                }.bind(this));
            };
            
            var requestRepoName = function(){
                this.prompt({
                    type: "input",
                    name: 'githubPagesUrl',
                    message: 'What is your Github Pages address?'
                }, function(props){
                    var url = props.githubPagesUrl;
                    
                    if (url.indexOf('.git') === -1) {
                        url += '.git';
                    }
                    
                    if (url.indexOf('https://github.com/') !== -1 || url.indexOf('git@github.com:') !== -1) {
                        this.githubPagesUrl = props.githubPagesUrl;
                    } else {
                        this.githubPagesUrl = 'git@github.com:' + url;
                    }
                        
                }.bind(this));
            };
            
            if (props.githubPages) {
                var remoteUrl = checkOrigin();
                
                if (remoteUrl){
                    checkRepoName(remoteUrl).bind(this);
                } else {
                    requestRepoName().bind(this);
                }
            } else {
                this.githubPagesUrl = false;
            }
            
            done();
        }.bind(this));
    },
    
    _processDirectory: function(source, destination) {
        var root = this.isPathAbsolute(source) ? 
            source : 
            path.join(this.sourceRoot(), source);
        
        var files = this.expandFiles('**', { dot: true, cwd: root });

        for (var i = 0; i < files.length; i++) {
            var f = files[i];
            var src = path.join(root, f);
            
            if (path.basename(f).indexOf('_') == 0 && path.dirname(f).indexOf('/sass/') === -1) {
                var dest = path.join(destination, path.dirname(f), path.basename(f).replace(/^_/, ''));
                this.template(src, dest);
            }
            else {
                var dest = path.join(destination, f);
                this.copy(src, dest);
            }
        }
    },

    writing: function () {
        this._processDirectory('root', '');
    },

    install: function () {
        this.npmInstall();
    },
    
    end: function(){
        this.log(chalk.magenta('Thanks for installing! Run "grunt watch" to watch for changes to your app or sass and update as required.'));
    }
});

module.exports = MinGenerator;
