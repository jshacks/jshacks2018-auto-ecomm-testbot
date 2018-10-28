const fs      = require('fs');
const path    = require('path');
const Decimal = require('decimal.js');
const _ = require('lodash');

const websites = require('./../data/input_websites');

const lighthouseDir = path.resolve(__dirname, '../data/lighthouse');
const cssDir = path.resolve(__dirname, '../data/css');

const userData = path.resolve(__dirname, '../data/user_data.csv');
const mockData = path.resolve(__dirname, '../data/mock_data.csv');

let metrics = {performance: [], ui: []};
let labels = {performance: [], ui: []};
for (const website of websites) {
  let lighthouseMetrics =fs.existsSync(path.resolve(lighthouseDir, `${website.slug}.json`)) ? JSON.parse(fs.readFileSync(path.resolve(lighthouseDir, `${website.slug}.json`), 'utf8')):null;
  let cssMetrics = JSON.parse(fs.readFileSync(path.resolve(cssDir, `${website.slug}.json`), 'utf8'))[0];

  const performanceMetrics = [
    new Decimal(_.get(lighthouseMetrics, '.categories[\'accessibility\'].score') || 0).mul(100).toNumber(),
    new Decimal(_.get(lighthouseMetrics, '.categories[\'best-practices\'].score') || 0).mul(100).toNumber(),
    new Decimal(_.get(lighthouseMetrics, '.categories[\'performance\'].score') || 0).mul(100).toNumber(),
    new Decimal(_.get(lighthouseMetrics, '.categories[\'pwa\'].score') || 0).mul(100).toNumber(),
    new Decimal(_.get(lighthouseMetrics, '.categories[\'seo\'].score') || 0).mul(100).toNumber(),
  ];
  const uiMetrics = [
      new Decimal(_.get(cssMetrics, 'uniqueColor') || 0).div(100).toNumber(),
      new Decimal(_.get(cssMetrics, 'backgroundColor') || 0).div(100).toNumber(),
      new Decimal(_.get(cssMetrics, 'fontSize') || 0).div(100).toNumber(),
      new Decimal(_.get(cssMetrics, 'fontFamily') || 0).div(100).toNumber(),
      new Decimal(_.get(cssMetrics, 'padding') || 0).div(100).toNumber(),
  ];

  // generate mock data
  const header = fs.readFileSync(path.resolve(userData), 'utf8').split('\n')[0];

  fs.writeFileSync(mockData, header);
  for (let i = 0; i < Math.floor(Math.random() * (500000 - 250000)) + 1; i++) {
    const perfValue = new Decimal(performanceMetrics.reduce((acc, val) => new Decimal(acc).add(val).toNumber(), 0)).floor().div(100).ceil().toNumber();
    const uiValue = new Decimal(uiMetrics.reduce((acc, val) => new Decimal(acc).add(val).toNumber(), 0)).floor().div(100).ceil().toNumber();

    fs.appendFileSync(mockData, `\n10/27/2018 17:04:08,,,,,,${perfValue},${uiValue}`);
  }

  // load data
  let data = fs.readFileSync(mockData, 'utf8').split('\n');

  data.shift();

  for (let row of data) {
    const perfValue = row.split(',')[6];
    const uiValue   = row.split(',')[7];

    metrics.performance.push(performanceMetrics);
    labels.performance.push([new Decimal(perfValue).toNumber()]);
    metrics.ui.push(uiMetrics);
    labels.ui.push([new Decimal(uiValue).toNumber()]);
  }
}

const performanceTrainData = metrics.performance.slice(0, new Decimal(metrics.performance.length).mul(0.9).floor());
const performanceTestData  = metrics.performance.slice(new Decimal(metrics.performance.length).mul(0.9).floor(), metrics.performance.length);
fs.writeFileSync(path.resolve(__dirname, '../data/performance_train.json'), JSON.stringify(performanceTrainData));
fs.writeFileSync(path.resolve(__dirname, '../data/performance_test.json'), JSON.stringify(performanceTestData));

const uiTrainData = metrics.ui.slice(0, new Decimal(metrics.ui.length).mul(0.9).floor());
const uiTrainLabels = labels.ui.slice(0, new Decimal(metrics.ui.length).mul(0.9).floor());
const uiTestData  = metrics.ui.slice(new Decimal(metrics.ui.length).mul(0.9).floor(), metrics.ui.length);
const uiTestLabels  = labels.ui.slice(new Decimal(metrics.ui.length).mul(0.9).floor(), metrics.ui.length);
fs.writeFileSync(path.resolve(__dirname, '../data/ui_train_data.json'), JSON.stringify(uiTrainData));
fs.writeFileSync(path.resolve(__dirname, '../data/ui_train_labels.json'), JSON.stringify(uiTrainLabels));
fs.writeFileSync(path.resolve(__dirname, '../data/ui_test_data.json'), JSON.stringify(uiTestData));
fs.writeFileSync(path.resolve(__dirname, '../data/ui_test_labels.json'), JSON.stringify(uiTestLabels));

return;