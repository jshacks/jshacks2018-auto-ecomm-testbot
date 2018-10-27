const fs             = require('fs');
const path           = require('path');
const chromeLauncher = require('chrome-launcher');

const lighthouse = require('./lighthouse');
const css        = require('./cssStats');

const websites = require('./../data/input_websites');

chromeLauncher.launch({chromeFlags: ['--headless']}).then(chrome => {
  for (const website of [{
    "slug": "emag",
    "base_url": "emag.ro",
    "main_url": "https://www.emag.ro/homepage",
    "category": "Retail"
  }]) {
    Promise.all([
      lighthouse(website.slug, website.main_url, chrome),
      css(website.slug, website.main_url),
    ]).then(results => {
      fs.writeFile(path.resolve(__dirname, `./../data/lighthouse/${website.slug}.json`), JSON.stringify(results[0]),function() {});
      fs.writeFile(path.resolve(__dirname, `./../data/css/${website.slug}.json`), JSON.stringify(results[1]),function() {});
    });
  }
});