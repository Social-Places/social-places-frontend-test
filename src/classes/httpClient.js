import axios from 'axios';
import _ from 'lodash';
import {serverBus} from '@/main';
const routes = require('@/classes/routes.json');


let config = {
    baseURL: "http://localhost",
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
    },
};
const meta = document.querySelector('meta[name="csrf-token"]');
if (meta && meta.getAttribute('content')) {
    config.headers['X-CSRF-TOKEN'] = meta.getAttribute('content');
}

const axiosClient = axios.create(config);
axiosClient.CancelToken = axios.CancelToken;
axiosClient.isCancel = axios.isCancel;
axiosClient.shouldLogResponse = false;
axiosClient.shouldLogError = false;
axiosClient.alerts = true;
const alertsInterceptor = (response) => {
    let addedAlert = false;
    if (response?.data?.alerts) {
        let alerts = response.data.alerts;
        alerts.forEach((alert) => {
            addedAlert = true;
            serverBus.$emit('alert', alert);
        });
    }
    if (response?.data?.fixedAlerts && Object.keys(response.data.fixedAlerts).length > 0) {
        addedAlert = true;
        serverBus.$emit('fixed-alert', alert);
    }
    return addedAlert;
};
const shouldLogResponse = (response) => {
    if (axiosClient.shouldLogResponse) {
        console.log(response);
    }
};

const shouldLogError = (error) => {
    if (axiosClient.shouldLogError) {
        console.error(error.response);
    }
};

const notOnline = () => {
    // Snackbar().error('You seem to not be connected to the internet, please reconnect and try again.');
};
const displayBlobErrorMessages = (error, currentAlertAdded) => {
    let alertAdded = currentAlertAdded;
    if (error?.request?.responseType === 'blob' && error.response?.data instanceof Blob && error.response?.data?.type === 'application/json') {
        try {
            const fileReader = new FileReader();
            fileReader.onload = () => {
                const blobData = JSON.parse(fileReader.result);
                if (blobData?.alerts || blobData?.fixedAlerts) {
                    // alertAdded = alertsInterceptor({data: blobData});
                }
            };
            fileReader.readAsText(error.response.data);
        } catch (e) {
            console.error(e);
        }
    }
    return alertAdded;
};
const displayErrorMessages = (error) => {
    if (!navigator.onLine) {
        _.debounce(notOnline, 1000);
        return;
    }

    if (!error?.response?.status) {
        return;
    }
    let alertAdded = false;
    const statusCode = error.response.status;
    if (error?.response?.data?.alerts || (error?.response?.data?.fixedAlerts && Object.keys(error.response.data.fixedAlerts).length > 0)) {
        alertAdded = alertsInterceptor(error.response);
    }
    alertAdded = displayBlobErrorMessages(error, alertAdded);
    let message = null;
    let type = null;
    switch (statusCode) {
        case 500:
            message = `Whoops, there was an issue trying to process your request, please contact support if this persists.`;
            type = 'error';
            break;
        case 504:
        case 408:
        case 410:
            message = `Your request took to long to process, please contact support if this persists.`;
            type = 'error';
            break;
        case 404:
            message = `We could not find what you are looking for, please contact support if this persists.`;
            type = 'warning';
            break;
        case 403:
            message = `You lack the proper permissions to perform this operation, please contact support if this persists.`;
            type = 'error';
            break;
        case 401:
        case 421:
            if (error.response.data?.redirect) {
                setTimeout(() => {
                    window.location = error.response.data.redirect;
                }, 2000);
            }
            if (error.response.data) {
                if (error.request.responseType === 'arraybuffer' && error.response.data.toString() === '[object ArrayBuffer]') {
                    error.response.data = JSON.parse(Buffer.from(error.response.data).toString('utf8'));
                }
            }
            break;
        default:
            if (error.response.data) {
                if (error.request.responseType === 'arraybuffer' && error.response.data.toString() === '[object ArrayBuffer]') {
                    error.response.data = JSON.parse(Buffer.from(error.response.data).toString('utf8'));
                    // alertsInterceptor(error.response);
                }
            } else {
                if (statusCode >= 400 && statusCode < 600) {
                    message = `The action you tried to perform could not be completed, please contact support if this persists.`;
                    type = 'error';
                }
            }
    }
    if (message === null || type === null || alertAdded) {
        return;
    }
   /* SnackbarStore.commit('push', {
        type: type,
        text: message,
    });*/
};

axiosClient.interceptors.request.use(request => {
    if (request.url.substr(-1) === '/') {
        request.url = request.url.substr(0, request.url.length - 1);
    }

    for (let param in request.params) {
        let paramRegex = new RegExp(`:${param}`, 'g');
        if (paramRegex.test(request.url)) {
            request.url = request.url.replace(paramRegex, request.params[param]);
            delete request.params[param];
        }
    }

    return request;
});
axiosClient.interceptors.response.use(
    response => {
        shouldLogResponse(response);
        if (axiosClient.alerts) {
            // alertsInterceptor(response);
        }
        return response;
    },
    error => {
        shouldLogError(error);
        if (axiosClient.alerts) {
            displayErrorMessages(error);
        }
        return Promise.reject(error);
    },
);
const get = (url, params, config) => {
    let currentUrl = url;
    if (routes.GET[url]) {
        currentUrl = routes.GET[url];
    }

    return axiosClient.get(currentUrl, {params, ...config});
}

const post = (url, data = {}, config = null) => {
    let formData = new FormData();
    if (Array.isArray(data)) {
        formData.appendArray(data);
    } else {
        let flatData = data.flattenObjectHelper(null, '.');
        for (let key of Object.keys(flatData)) {
            if (Array.isArray(flatData[key])) {
                formData.appendArray(key, flatData[key]);
            } else {
                if (flatData[key] === true || flatData[key] === false) {
                    formData.append(key, flatData[key] === true ? 1 : 0);
                } else {
                    formData.append(key, flatData[key]);
                }
            }
        }
    }

    let currentUrl = url;
    if (routes.POST[url]) {
        currentUrl = routes.POST[url];
    }

    return axiosClient.post(currentUrl, formData, config);
};
const put = (url, data = null, config) => {
    data['_method'] = 'PUT';

    let currentUrl = url;
    if (routes.PUT[url]) {
        currentUrl = routes.PUT[url];
    }

    return post(currentUrl, data, config);
};

const patch = (url, data = null, config) => {
    data['_method'] = 'PATCH';

    let currentUrl = url;
    if (routes.PATCH[url]) {
        currentUrl = routes.PATCH[url];
    }

    return post(currentUrl, data, config);
};

const processExportDownload = (url, data) => {
    return post(url, data, {responseType: 'arraybuffer'})
        .then(({status, data, headers}) => {
            if (status === 201) {
                try {
                    data = JSON.parse((new TextDecoder()).decode(data));
                    alertsInterceptor({data});
                    return true;
                } catch (e) {
                    return true;
                }
            }
            if (status === 202) {
                // Snackbar().warning('The information you are trying to export is too large. It will be processed later and you will receive a email.');
                return true;
            }
            if (status === 204) {
                // Snackbar().warning('We could not find any information to export.');
                return true;
            }
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            let fileName = headers['content-disposition'].split('filename=')[1].replace(/[;"]/g, '');
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            setTimeout(() => {
                link.remove();
                window.URL.revokeObjectURL(url);
            }, 500);
            return true;
        });
}

export default {get, patch, put, post, processExportDownload, axiosClient};
