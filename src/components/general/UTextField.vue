<template>
    <v-text-field
        ref="input"
        v-model="internalValue"
        :error-messages="internalErrorMessages"
        :loading="internalLoading || loading"
        v-bind="[$attrs, $props]"
        v-on="internalListeners"/>
</template>

<script>
import httpClient from "@/classes/httpClient";

export default {
    name: "UTextField", // Unique TextField
    props: {
        value: {
            type: String,
        },
        errorMessages: {
            type: [String, Array],
            default: () => [],
        },
        checkUrl: {
            type: String,
            required: true,
        },
        itemId: {
            type: [Number, String],
        },
        loading: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            errors: [],
            internalLoading: false,
        }
    },
    computed: {
        internalErrorMessages() {
            if (Array.isArray(this.errorMessages) && Array.isArray(this.errors)) {
                return this.errors.concat(this.errorMessages);
            }
            if (typeof this.errorMessages === 'string' && Array.isArray(this.errors)) {
                return this.errors.concat([this.errorMessages]);
            }
            return [];
        },
        internalListeners() {
            let listenersToUse = {
                input: [this.clearError],
                change: [this.checkUniqueness],
            }
            let incomingListeners = this.$listeners;

            for (let listener in incomingListeners) {
                if (listenersToUse.hasOwnProperty(listener)) {
                    listenersToUse[listener].push(incomingListeners[listener]);
                } else {
                    listenersToUse[listener] = incomingListeners[listener];
                }
            }
            return listenersToUse;
        },
        internalValue: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value);
            },
        },
    },
    methods: {
        checkUniqueness() {
            if (this.internalValue) {
                this.internalLoading = true;
                let data = {'value': this.internalValue}
                if (this.itemId) {
                    data['id'] = this.itemId;
                }
                httpClient.post(this.checkUrl, data).then(() => {
                }).catch((e) => {
                    this.errors = e.response.data.errors;
                }).finally(() => {
                    this.internalLoading = false;
                });
            }
        },
        clearError() {
            this.errors = [];
        },
        validate() {
            let input = this.$refs.input;
            return input.validate() && !(input.externalError ?? false);
        },
        resetValidation() {
            this.clearError();
            this.$refs.input.resetValidation();
        },
    },
}
</script>

<style scoped>

</style>
