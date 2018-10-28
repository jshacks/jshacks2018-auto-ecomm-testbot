const tf   = require('@tensorflow/tfjs');
const fs   = require('fs');
const path = require('path');

require('@tensorflow/tfjs-node');

const performanceTrainData = JSON.parse(fs.readFileSync('./data/performance_train.json', 'utf8'));

const performanceXs = tf.tensor2d(performanceTrainData.slice(0, 5));
const performanceYs = tf.tensor2d(performanceTrainData.slice(5, performanceTrainData.length));

const model = tf.sequential();

// Two layers with dropout between
model.add(tf.layers.dense({units: 10, activation: 'relu'}));
model.add(tf.layers.dropout({rate: 0.01}));
model.add(tf.layers.dense({units: 5, activation: 'relu'}));

// 5 classes for each test value
model.add(tf.layers.dense({units: 5, activation: 'softmax'}));

performance.print();