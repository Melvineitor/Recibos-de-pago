// filepath: update-angular-json.js
const fs = require('fs');
const ini = require('ini');
const path = require('path');

// Read the config.ini file
const configPath = path.join(__dirname, 'src', 'assets', 'config.ini');
const config = ini.parse(fs.readFileSync(configPath, 'utf-8'));

// Read the angular.json file
const angularJsonPath = path.join(__dirname, 'angular.json');
const angularJson = JSON.parse(fs.readFileSync(angularJsonPath, 'utf-8'));

// Update the host value in angular.json
if (config.Server && config.Server.BaseUrl) {
  const url = new URL(config.Server.BaseUrl);
  angularJson.projects['proyect'].architect.serve.options.host = url.hostname;
}

// Write the updated angular.json file
fs.writeFileSync(angularJsonPath, JSON.stringify(angularJson, null, 2));

console.log('Updated angular.json with host:', angularJson.projects['proyect'].architect.serve.options.host);