import Vue from 'vue';

export const loadComponent = (fileName, path) => {
    let componentName = (
        fileName.split('/').pop().replace(/\.\w+$/, '')
    ).replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    fileName = fileName.substring(2);
    Vue.component(componentName, () => import (`${path}${fileName}`));
};

export const wait = (time) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
};