import operations from '../lib/operations.js';

const { API_TOKEN = '' } = process.env;
const operationId =
  '2ec040be783b5beba3f08174933789104de629704ff7a2809a4f52c6d238ea5f';

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
