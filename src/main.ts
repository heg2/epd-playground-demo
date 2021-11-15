import { createApp } from 'vue';
import App from './App.vue';
import { JSOnFhir } from '@i4mi/js-on-fhir';

const app = createApp(App);
app.config.globalProperties = {
    $fhir: new JSOnFhir('https://test.ahdis.ch/mag-bfh', 'irrelevant', 'irr🐘', true)
};
app.mount('#app');
