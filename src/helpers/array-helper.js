if (!Array.prototype.first) {
    Object.defineProperty(Array.prototype, 'first', {
        value: function () {
            return this[0];
        },
    });
}

if (!Array.prototype.last) {
    Object.defineProperty(Array.prototype, 'last', {
        value: function () {
            return this[this.length - 1];
        },
    });
}

if (!Array.prototype.prettyJoin) {
    Object.defineProperty(Array.prototype, 'prettyJoin', {
        value: function () {
            if (this.length === 1) {
                return this.last();
            }

            this.sort((a, b) => {
                if (a < b) {
                    return -1;
                }

                if (b < a) {
                    return 1;
                }

                return 0;
            });

            let str = '';
            if (this.length > 2) {
                for (let i = 0; i < this.length - 2; i++) {
                    str += this[i] + ', ';
                }
            }
            str += this[this.length - 2] + ' and ' + this.last();
            return str;
        },
    });
}

if (!Array.prototype.prettyList) {
    Object.defineProperty(Array.prototype, 'prettyList', {
        value: function () {
            if (this.length === 1) {
                return this.last();
            }

            this.sort((a, b) => {
                if (a < b) {
                    return -1;
                }

                if (b < a) {
                    return 1;
                }

                return 0;
            });

            let str = '';
            if (this.length > 2) {
                for (let i = 0; i < this.length - 2; i++) {
                    str += this[i] + ',<br/>';
                }
            }
            str += this[this.length - 2] + ' and<br/>' + this.last();
            return str;
        },
    });
}

if (!Array.prototype.equal) {
    Object.defineProperty(Array.prototype, 'equal', {
        value: function (array) {
            if (!Array.isArray(array)) {
                throw Error('Type mismatch');
            }

            if (this === array) {
                return true;
            }
            if ((this == null || array == null) || (this.length !== array.length)) {
                return false;
            }
            let self = [...this];
            let other = [...array];

            self.sort();
            other.sort();
            for (let i = 0; i < self.length; i++) {
                if (self[i] !== other[i]) {
                    return false;
                }
            }
            return true;
        },
    });
}

if (!Array.prototype.limit) {
    Object.defineProperty(Array.prototype, 'limit', {
        value: function (limit) {
            if (this.length <= limit) {
                return this;
            }

            return this.slice(0, limit);
        },
    });
}

if (!Array.prototype.ulList) {
    Object.defineProperty(Array.prototype, 'ulList', {
        value: function (limit = 0) {
            if (limit === 0) {
                limit = this.length;
            }

            let str = '<ul>';
            for (let i = 0; i < Math.min(this.length, limit); i++) {
                str += '<li>' + this[i].trim() + '</li>';
            }
            if (limit < this.length) {
                str += '<li>etc...</li>';
            }

            str += '</ul>';
            return str;
        },
    });
}

if (!Array.prototype.findRecursive) {
    Object.defineProperty(Array.prototype, 'findRecursive', {
        value: function (predicate, childArray = 'children') {
            let result;

            function iter(item) {
                if (predicate(item)) {
                    result = item;
                    return true;
                }
                return Array.isArray(item[childArray]) && item[childArray].some(iter);
            }

            this.some(iter);
            return result;
        },
    });
}
