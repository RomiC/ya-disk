const {info} = require('../src/info');
const {API_KEY} = require('./constants');

const success = (info) => {
  console.log(info)
};

const error = (error) => {
  console.error(`${error.name}: '${error.message}'`);
};

info(API_KEY, success, error);