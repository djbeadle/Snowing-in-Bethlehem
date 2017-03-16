# Snowing-in-Bethlehem
A simple NodeJS web server that answers the question, "Is it snowing in Bethlehem, Pennsylvania at the moment?"

Currently running at http://samrogalsky.com:8181

This program can easily be adapted to any other location you choose!
Get a free developer account from DarkSky.net/dev, plug your lat/long coordinates and placename into the config.js file, type "npm install" and then "npm start".

If you want to run this as a service, you can put the contents of the app in "/srv/www/snow_in_bethlehem", the file "snowwatcher" into "/etc/init.d" and then control it with "sudo /etc/init.d/snowwatcher start" and "sudo /etc/init.d/snowwatcher stop --force". The "status" command works as well. The file snowwatcher is based upon Chovy's node-startup script whcih you can find here: https://github.com/chovy/node-startup

Inspired by http://isitsnowinginpdx.com
