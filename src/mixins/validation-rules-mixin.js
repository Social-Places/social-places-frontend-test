import {
    required,
    tel,
    email,
    name,
    requiredArray,
    url,
    urlOrContainsReplaceField,
    maxLength,
    minLength,
    domain,
    urlWithScheme,
} from '@/constants/rule-constants';

export const validationRulesMixin = {
    methods: {
        getText(ref = null) {
            let text = 'This field';
            if (ref?.$props?.label) {
                text = `${ref?.$props?.label}`;
            }
            return text;
        },
        isRequired(vModel, ref = null) {
            return required(vModel) || `${this.getText(ref)} is required`;
        },
        isTel(vModel) {
            return tel(vModel) || 'Not a valid number';
        },
        isEmail(vModel) {
            return email(vModel) || 'Not an email';
        },
        isValidName(vModel) {
            return name(vModel) || 'Not a valid name';
        },
        isRequiredArray(vModel, ref = null) {
            return requiredArray(vModel) || `${this.getText(ref)} is required`;
        },
        isUrl(vModel, ref = null) {
            return url(vModel) || `${this.getText(ref)} is not a valid url`;
        },
        isUrlOrContainsReplaceField(vModel, ref = null) {
            return urlOrContainsReplaceField(vModel) || `${this.getText(ref)} is not a valid url`;
        },
        isMaxLength(vModel, length, ref = null) {
            return maxLength(vModel, length) || `${this.getText(ref)} should have a maximum length of ${length}`;
        },
        isMinLength(vModel, length, ref = null) {
            return minLength(vModel, length) || `${this.getText(ref)} should have a minimum length of ${length}`;
        },
        isDomain(vModel, ref = null) {
            return domain(vModel) || `${this.getText(ref)} is not a valid domain`;
        },
        isUrlWithScheme(vModel, ref = null) {
            return urlWithScheme(vModel, true) || `${this.getText(ref)} is not a valid url. Ensure there is a scheme present in the given URL (i.e. https://)`;
        },
    },
};
