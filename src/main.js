import Vue from 'vue';
import App from './App';
import router from './router';
import Vuetify from 'vuetify';
import '@/scss/main.scss';
import vuetify from './plugins/vuetify';
import httpClient from './classes/httpClient';
import ServerBus from './classes/ServerBus';
import {loadComponent} from './helpers/build-functions';
import {isDevelopment} from './helpers/value-helpers';

import './helpers/array-helper';
import './helpers/string-helper';
import './helpers/object-helper';
import './helpers/formdata-helper';

Vue.config.productionTip = false

let requireComponent = require.context(
    './components',
    true,
    /[A-Z]\w+\.(vue|js)$/,
    'lazy',
);

export const serverBus = new ServerBus();

Vue.use(Vuetify);

requireComponent.keys().forEach(fileName => {
  loadComponent(fileName, './components/');
});

Vue.config.errorHandler = function (err) {
  if (isDevelopment()) {
    console.error(err);
  } else {
    // GlobalNetworkService().postLogException(err, info);
  }
};

new Vue({
  vuetify,
  httpClient,
  router,
  el: '#app',
  render: h => h(App),
}).$mount('#app');
