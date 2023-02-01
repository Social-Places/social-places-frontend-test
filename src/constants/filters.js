import Vue from 'vue';
import {DateTime} from 'luxon';

const formatDate = Vue.filter('formatDate', (value, format) => {
    if (value === '' || value === undefined || value === null) {
        return '';
    }
    if (format === undefined || format === '') {
        format = 'dd MMMM yyyy';
    }
    let toFormat = null;
    if (value instanceof DateTime) {
        toFormat = value;
    } else {
        toFormat = DateTime.fromFormat(value, 'yyyy-MM-dd HH:mm:ss');
    }
    return toFormat.toFormat(format.replace('\'', '\'|\'')).replace('|', '\'');
});

export const filters = {
    formatDate,
};
