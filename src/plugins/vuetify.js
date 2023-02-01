import '@fortawesome/fontawesome-free/css/all.css';
import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

const opts = {
    theme: {
        options: {
            customProperties: true,
        },
        dark: false,
        themes: {
            light: {
                primary: '#b980d0',
                darkPrimary: '#2A2342',
            },
            dark: {
                primary: '#b980d0',
                darkPrimary: '#2A2342',
            }
        }
    },

    icons: {
        iconfont: 'fa',
        values: {
            clear: 'fas fa-times',
            delete: 'fas fa-times',
        }
    },

};

export default new Vuetify(opts);
