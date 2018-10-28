const fs             = require('fs');
const path           = require('path');
const chromeLauncher = require('chrome-launcher');

const lighthouse = require('./lighthouse');
const css        = require('./cssStats');

const websites = require('./../data/input_websites');

chromeLauncher.launch({chromeFlags: ['--headless']}).then(chrome => {
  let promises = [];
  for (const website of websites.splice(0, 10)) {
    let promise = new Promise((resolve, reject) => {
      Promise.all([
        lighthouse(website.slug, website.main_url, chrome),
        css(website.slug, website.main_url),
      ]).then(results => {
        resolve({
          slug      : website.slug,
          lighthouse: results[0],
          css       : results[1],
        });
      }).catch(error => {
        reject(error);
      });
    });
    
    promises.push(promise);
  }
  
  Promise.all(promises).then(websites => {
    for (const websiteResults of websites) {
      fs.writeFile(path.resolve(__dirname, `./../data/lighthouse/${websiteResults.slug}.json`), JSON.stringify(websiteResults.lighthouse));
      fs.writeFile(path.resolve(__dirname, `./../data/css/${websiteResults.slug}.json`), JSON.stringify(websiteResults.css));
    }
  }).then(() => {
    chrome.kill();
    console.log('--> Done!');
    return;
  }).catch(error => {
    console.error(error);
  });
});