import list from '../lib/list';

const API_TOKEN = '';

list(API_TOKEN, {}, ({ items }) => items.forEach(({ name, size }) => console.log('%s: %dB', name, size)));