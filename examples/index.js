import '@babel/polyfill';
import '../src/style.js';
import { createApp, version } from 'vue';
import App from './App.vue';
import Tooltip from '@/Tooltip';

// eslint-disable-next-line no-console
console.log('Vue version: ', version);
const app = createApp(App);

app.component('Tooltip', Tooltip);
app.mount('#app');
