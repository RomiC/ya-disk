import info from '../lib/info';

const { API_TOKEN } = process.env;

(async () => {
  try {
    const { total_space, used_space } = await info(API_TOKEN);

    console.log(`
Total space: ${Math.round(total_space / 1000000000)}GB
Free space: ${Math.round((total_space - used_space) / 1000000)}MB
`);
  } catch (error) {
    console.error(error);
  }
})();
