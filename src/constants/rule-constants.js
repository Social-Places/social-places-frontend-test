const isNumber = (n) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

const required = (vModel) => {
    return typeof vModel === 'string' ? !!vModel.trim() : !!vModel;
};

const requiredArray = (vModel) => {
    return Array.isArray(vModel) && vModel.length > 0;
};

const tel = (vModel) => {
    return !vModel || (vModel.match(/^(\+)?(\d+ )*\d+$/g)?.length > 0);
};

const email = (vModel) => {
    return !vModel || (vModel.match(/^[a-zA-Z0-9][a-zA-Z0-9._+-]*[a-zA-Z0-9_]@[a-zA-Z0-9][a-zA-Z0-9._-]*[a-zA-Z0-9]\.[a-zA-Z]{2,63}$/g)?.length > 0);
};

const name = (vModel) => {
    return !vModel ||
        (vModel.match(/^[a-zA-Z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'&@-]+$/gu)?.length > 0);
};

const url = (vModel) => {
    return !vModel ||
        (vModel.match(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g)?.length > 0);
};
const urlOrContainsReplaceField = (vModel) => {
    return !vModel ||
        (vModel.match(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g)?.length >
            0) ||
        (vModel.match('/[[a-zA-Z0-9]+]/g')?.length > 0);
};
const maxLength = (vModel, length) => {
    return !vModel || (vModel && vModel.length <= length);
};
const minLength = (vModel, length) => {
    return !vModel || (vModel && vModel.length >= length);
};
const domain = (vModel) => {
    return !vModel || (vModel.match(/^[a-z0-9][a-z0-9-]{1,61}[a-z0-9](?:\.[a-z]{2,})+$/g)?.length > 0);
};
const urlWithScheme = (vModel) => {
    return !vModel ||
        (vModel.match(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g)?.length > 0);
};
export {
    isNumber,
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
    urlWithScheme
};
