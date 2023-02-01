// https://eslint.org/docs/user-guide/configuring
module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:vue/base',
        'plugin:vue/essential',
        'plugin:vue/recommended'
    ],
    rules: {
        // override/add rules settings here, such as:
        'vue/no-unused-vars': 'error',
        'vue/no-v-html': 'off',
        'vue/no-v-text-v-html-on-component': 'off',
        'vue/html-indent': 'off',
        'vue/max-attributes-per-line': 'off',
        'vue/html-closing-bracket-spacing': 'off',
        'vue/html-closing-bracket-newline': 'off',
        'vue/valid-v-slot': 'off',
        'no-prototype-builtins': 'off',
        'no-undef': 'off',
    },
    "globals": {
        "_": true
    },
}
