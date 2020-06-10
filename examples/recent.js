import recent from '../lib/recent';

const { API_TOKEN = '' } = process.env;

(async () => {
  try {
    const { items } = await recent(API_TOKEN, { media_type: 'image' });

    items.forEach((item) => console.log(`${item.name} (${item.size}B)`));
  } catch (error) {
    console.error(error);
  }
})();
