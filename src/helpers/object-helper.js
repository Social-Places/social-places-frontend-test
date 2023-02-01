if (!Object.prototype.hasOwnProperties) {
    Object.defineProperty(Object.prototype, 'hasOwnProperties', {
        value: function (arr) {
            if (Array.isArray(arr)) {
                if (arr.length === 0) {
                    throw new Error('Input array length needs to be more than 0');
                }

                for (let item of arr) {
                    if (!this.hasOwnProperty(item)) {
                        return false;
                    }
                }
                return true;
            } else {
                if (typeof arr == 'string') {
                    return this.hasOwnProperty(arr);
                } else {
                    throw new Error('Only array or string types accepted');
                }
            }
        },
    });
}

if (!Object.prototype.hasEitherProperties) {
    Object.defineProperty(Object.prototype, 'hasEitherProperties', {
        value: function (arr) {
            if (Array.isArray(arr)) {
                if (arr.length === 0) {
                    throw new Error('Input array length needs to be more than 0');
                }

                for (let item of arr) {
                    if (this.hasOwnProperty(item)) {
                        return true;
                    }
                }
                return false;
            } else {
                if (typeof arr == 'string') {
                    return this.hasOwnProperty(arr);
                } else {
                    throw new Error('Only array or string types accepted');
                }
            }
        },
    });
}

if (!Object.prototype.convertNullToEmpty) {
    Object.defineProperty(Object.prototype, 'convertNullToEmpty', {
        value: function () {
            const cleaned = {};
            Object.keys(this).forEach(key => {
                cleaned[key] = this[key] === null ? '' : this[key];
            });
            return cleaned;
        },
    });
}

if (!Object.prototype.unsetNullFields) {
    Object.defineProperty(Object.prototype, 'unsetNullFields', {
        value: function () {
            const cleaned = {};
            Object.keys(this).forEach(key => {
                if (this[key] !== null) {
                    cleaned[key] = this[key];
                }
            });
            return cleaned;
        },
    });
}

const flattenObjectHelper = (obj, prefix = null, separator = '.') => {
    let object = {};
    if (separator === null) {
        separator = '.';
    }

    if (typeof obj === 'object' && obj !== null) {
        for (let key of Object.keys(obj)) {
            if (Array.isArray(obj[key])) {
                let subArray = [];
                for (let item of obj[key]) {
                    if (typeof item !== 'object' || item === null) {
                        subArray.push(item);
                    }
                }
                object[(prefix ? prefix + separator : '') + key] = subArray;
            } else {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    let flatObj = flattenObjectHelper(obj[key], key, separator);
                    for (let flat of Object.keys(flatObj)) {
                        object[(prefix ? prefix + separator : '') + flat] = flatObj[flat];
                    }
                } else {
                    object[(prefix ? prefix + separator : '') + key] = obj[key] || '';
                }
            }
        }
    }
    return object;
};

if (!Object.prototype.flattenObjectHelper) {
    Object.defineProperty(Object.prototype, 'flattenObjectHelper', {
        value: function (prefix, separator = ' - ') {
            return flattenObjectHelper(this, prefix, separator);
        },
    });
}
