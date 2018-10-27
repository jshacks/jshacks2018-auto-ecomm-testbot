const fs      = require('fs');
const path    = require('path');
const Decimal = require('decimal.js');

const websites = require('./../data/input_websites');

const lighthouseDir = path.resolve(__dirname, '../data/lighthouse');

const userData = path.resolve(__dirname, '../data/user_data.csv');
const mockData = path.resolve(__dirname, '../data/mock_data.csv');

for (const website of websites.splice(0, 1)) {
  let metrics = {performance: [], ui: []};
  
  let lighthouseMetrics = JSON.parse(fs.readFileSync(path.resolve(lighthouseDir, `${website.slug}.json`), 'utf8'));
  
  const performanceMetrics = [
    new Decimal(lighthouseMetrics.categories['accessibility'].score || 0).mul(100).toNumber(),
    new Decimal(lighthouseMetrics.categories['best-practices'].score || 0).mul(100).toNumber(),
    new Decimal(lighthouseMetrics.categories['performance'].score || 0).mul(100).toNumber(),
    new Decimal(lighthouseMetrics.categories['pwa'].score || 0).mul(100).toNumber(),
    new Decimal(lighthouseMetrics.categories['seo'].score || 0).mul(100).toNumber(),
  ];
  
  // generate mock data
  const header = fs.readFileSync(path.resolve(userData), 'utf8').split('\n')[0];
  
  fs.writeFileSync(mockData, header);
  for (let i = 0; i < Math.floor(Math.random() * (10 - 1)) + 1; i++) {
    const perfValue = new Decimal(performanceMetrics.reduce((acc, val) => new Decimal(acc).add(val).toNumber(), 0)).floor().div(100).toNumber();
    const uiValue   = 0;
    
    fs.appendFileSync(mockData, `\n10/27/2018 17:04:08,,,,,,${perfValue},${uiValue}`);
  }
  
  // load data
  let data = fs.readFileSync(mockData, 'utf8').split('\n');
  
  data.shift();
  
  for (let row of data) {
    const perfValue = row.split(',')[6];
    const uiValue   = row.split(',')[7];
    
    metrics.performance.push(performanceMetrics.concat([new Decimal(perfValue).toNumber()]));
  }
  
  const performanceTrainData = metrics.performance.slice(0, new Decimal(metrics.performance.length).mul(0.9).floor());
  const performanceTestData  = metrics.performance.slice(new Decimal(metrics.performance.length).mul(0.9).floor(), metrics.performance.length);
  
  fs.writeFileSync(path.resolve(__dirname, '../data/performance_train.json'), JSON.stringify(performanceTrainData));
  fs.writeFileSync(path.resolve(__dirname, '../data/performance_test.json'), JSON.stringify(performanceTestData));
}

return;