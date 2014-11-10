<%= _.humanize(projectName) %>
============

##### Pre-installation

You will need...

- Your terminal of choice (I use [Git Bash](http://git-scm.com/downloads))
- [Node](http://nodejs.org/download/)
- Once they're both installed, open your terminal and type `npm install -g harp` to install [Harp server](http://harpjs.com/)


##### Install:

- Open the terminal and `cd` to the directory you want to store the website files (`cd <foldername>/<foldername>/etc`)
- Clone the repository to your computer, entering your Github credentials if asked
- `cd` into the project directory (`cd <%= projectName %>/`)
- Type `npm install`

Great! All is installed and ready to go.

To see the website running on your computer, make sure you're still in the `<%= projectName %>/` folder, and type `harp server www/` to start the Harp webserver.


##### Making changes:

When you make changes to SCSS or javascript, they won't necessarily be updated on the web server. To make sure they're updated, open another terminal window, `cd` to your `<%= projectName %>/` directory, and type `grunt watch`. This will watch the files for changes and update them when required.


##### Deploying your website:

When you're ready to push your changes to the website, type `grunt`.

This will compile your website, optimise it, and upload it to github. It should update on the website shortly afterwards, provided there aren't any build errors.