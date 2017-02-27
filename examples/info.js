import info from '../src/info';

const API_TOKEN = '';

info(API_TOKEN, ({total_space, used_space}) => {
  console.log(`
    Total space: ${Math.round(total_space / 1000000000)}GB
    Free space: ${Math.round((total_space - used_space) / 1000000)}MB
  `);
});
