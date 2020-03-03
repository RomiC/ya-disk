import operations from '../lib/operations';

const { API_TOKEN = '' } = process.env;
const operationId =
  'c3b600d85b7269c88704441667b4a53d09f9b3b6a1d90b652815016c28d59b5d';

operations(
  API_TOKEN,
  operationId,
  ({ status }) => {
    process.stdout.write(`
Operation "${operationId}" is ${status}.
  \n`);
  },
  (error) => process.stderr.write(error)
);
