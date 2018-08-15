import info from '../lib/info';

const { API_TOKEN = '' } = process.env;

info(
  API_TOKEN,
  ({ total_space, used_space }) =>
    process.stdout.write(`
Total space: ${Math.round(total_space / 1000000000)}GB
Free space: ${Math.round((total_space - used_space) / 1000000)}MB
    \n`)
);