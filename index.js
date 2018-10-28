const tf   = require('@tensorflow/tfjs');
const fs   = require('fs');
const path = require('path');
const _    = require('lodash');

require('@tensorflow/tfjs-node');

const uiTrainData   = JSON.parse(fs.readFileSync('./data/ui_train_data.json', 'utf8'));
const uiTrainLabels = JSON.parse(fs.readFileSync('./data/ui_train_labels.json', 'utf8'));

const uiTestData   = JSON.parse(fs.readFileSync('./data/ui_test_data.json', 'utf8'));
const uiTestLabels = JSON.parse(fs.readFileSync('./data/ui_test_labels.json', 'utf8'));

const xs = tf.tensor(uiTrainData);
// const ys = tf.tensor(uiTrainLabels);
// const ys = tf.tensor(_.flatten(uiTrainLabels));
const ys = tf.squeeze(tf.oneHot(tf.tensor(uiTrainLabels, undefined, 'int32'), 5));

const predict       = tf.tensor(uiTestData);
const predictLabels = _.flatten(uiTestLabels);

console.log(`--> Xs`);
xs.print();

console.log(`--> Ys`);
ys.print();

const model = tf.sequential();

// Two layers with dropout between
model.add(tf.layers.dense({units: 5, inputShape: 5, activation: 'relu'}));
model.add(tf.layers.dropout({rate: 0.3}));

// 5 classes for each test value
model.add(tf.layers.dense({units: 5, activation: 'softmax'}));

model.compile({optimizer: 'rmsprop', loss: 'categoricalCrossentropy', lr: 0.001, metrics: ['accuracy']});

console.log(xs.shape);
console.log(ys.shape);

model.fit(xs, ys, {
  batchSize: 500,
  epochs   : 5,
}).then(() => {
  // console.log('--> Prediction');
  
  return model.predict(predict).data();
}).then((predictionsData) => {
  // for (let [index, label] of predictLabels.entries()) {
  //   console.log(`--> Prediction #${index + 1}: ${predictionsData[index]} (${label})`);
  // }
}).catch(error => {
  console.error(error);
});

