const fs             = require('fs');
const path           = require('path');
const chromeLauncher = require('chrome-launcher');

const lighthouse = require('./lighthouse');
const css        = require('./cssStats');

const websites = require('./../data/input_websites');

chromeLauncher.launch({chromeFlags: ['--headless']}).then(chrome => {
  for (const website of websites.slice(0, 1)) {
    lighthouse(website.slug, website.main_url, chrome).then(result => {
      fs.writeFile(path.resolve(__dirname, `./../data/lighthouse/${website.slug}.json`), JSON.stringify(result));
    });
    
    css(website.main_url).then(result => {
      fs.writeFile(path.resolve(__dirname, `./../data/css/${website.slug}.json`), JSON.stringify(result));
    })
  }
});