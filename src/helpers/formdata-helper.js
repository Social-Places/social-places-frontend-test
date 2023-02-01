FormData.prototype.appendArray = function (name, arrValue) {
    if (!Array.isArray(arrValue)) {
        throw new Error('Not an array... use .append()');
    }

    for (let i = 0; i < arrValue.length; i++) {
        this.append(name + '[]', arrValue[i]);
    }
}

