if (!String.prototype.ucfirst) {
    Object.defineProperty(String.prototype, 'ucfirst', {
        value: function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        },
    });
}

if (!String.prototype.lcfirst) {
    Object.defineProperty(String.prototype, 'lcfirst', {
        value: function () {
            return this.charAt(0).toLowerCase() + this.slice(1);
        },
    });
}

if (!String.prototype.colorOnLength) {
    Object.defineProperty(String.prototype, 'colorOnLength', {
        value: function () {
            let colors = [
                '#b980d0',
                '#99e6d8',
                '#fa7f7f',
                '#f45197',
                '#8ab7e9',
                '#f4db6c'
            ];
            let colorsLen = colors.length;
            let color = Math.floor(this.replace(/ -/g, '').length % colorsLen);
            return colors[color];
        },
    });
}
if (!String.prototype.ucwords) {
    Object.defineProperty(String.prototype, 'ucwords', {
        value: function () {
            return this.replace(/(?:^|\s)\S/g, function (a) {
                return a.toUpperCase();
            });
        },
    });
}

if (!String.prototype.camelCaseToUcWords) {
    Object.defineProperty(String.prototype, 'camelCaseToUcWords', {
        value: function () {
            return this.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ').map((word) => word.ucfirst()).join(' ');
        },
    });
}

if (!String.prototype.snakeCaseToUcWords) {
    Object.defineProperty(String.prototype, 'snakeCaseToUcWords', {
        value: function () {
            return this.split('_').map((word) => word.ucfirst()).join(' ');
        },
    });
}

if (!String.prototype.initialize) {
    Object.defineProperty(String.prototype, 'initialize', {
        value: function (limit = 3) {
            try {
                let parts = this.split(/[ -]/);
                let initials = '';

                parts.forEach((part) => {
                    initials += part.charAt(0);
                });

                if (initials.length > limit && initials.match(/[A-Z]/)) {
                    initials = initials.replace(/[a-z]+/, '');
                }

                return initials.substr(0, limit).toUpperCase();
            } catch (exception) {
                return '';
            }
        },
    });
}

if (!String.prototype.toKebab) {
    Object.defineProperty(String.prototype, 'toKebab', {
        value: function () {
            return this.toLowerCase().split(' ').join('-');
        },
    });
}

if (!String.prototype.removeUnwantedWords) {
    Object.defineProperty(String.prototype, 'removeUnwantedWords', {
        value: function (wordsToRemove) {
            let expStr = wordsToRemove.join('|'); // Needs to be an array
            return this.replace(new RegExp('\\b(' + expStr + ')\\b', 'gi'), ' ').replace(/\s{2,}/g, ' ');
        },
    });
}

if (!String.prototype.camelToKebab) {
    Object.defineProperty(String.prototype, 'camelToKebab', {
        value: function () {
            return this.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        },
    });
}
