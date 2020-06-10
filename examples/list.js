import list from '../lib/list';

const { API_TOKEN = '' } = process.env;

(async () => {
  try {
    const { items } = await list(API_TOKEN);

    items.forEach((item, index) =>
      console.log(`${index + 1}. ${item.name} (${item.size}B)`)
    );
  } catch (error) {
    console.error(error);
  }
})();
