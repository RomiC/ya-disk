import meta from '../lib/meta';

const API_TOKEN = '';

meta.add(API_TOKEN, 'disk:/Зима.jpg', { my_field: 'my_value' }, null, console.error);

meta.get(API_TOKEN, 'disk:/Зима.jpg', {}, console.log);