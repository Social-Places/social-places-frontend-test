<template>
    <div class="d-flex pb-1">
        <v-select
            v-if="internalItems.length > 1 && !displayOnly"
            v-bind="$attrs"
            :class="{'table-select': tableMode}"
            :disabled="loading"
            :flat="tableMode"
            :item-text="itemText"
            :item-value="itemValue"
            :items="internalItems"
            :loading="loading"
            :solo="tableMode"
            :style="internalWidth"
            :value="value"
            class="basic-select"
            color="primary"
            dense
            hide-details
            item-color="primary"
            @change="handleChange">
            <template v-if="nestedItems" #item="{item}">
                <v-list-item-content>
                    <v-list-item-title :class="`pl-${item.level * spacingMultiplier}`">{{ item[itemText] }}</v-list-item-title>
                </v-list-item-content>
            </template>
        </v-select>
        <span v-else :class="{'with-margin': tableMode}" :style="internalWidth" class="selected-option selected-display-only">
            {{ calculatedValue[itemText] }}
        </span>
    </div>
</template>
<script>
import httpClient from '@/classes/httpClient';

export default {
    name: 'BasicSelect',
    props: {
        items: {
            type: Array,
            default: () => [],
        },
        value: {
            required: false,
        },
        rowItemId: {
            required: false,
            default: null,
        },
        tableMode: {
            type: Boolean,
            default: false,
        },
        width: {
            type: [Number, String],
            default: 0,
        },
        field: {
            type: String,
            default: null,
            required: false,
        },
        url: {
            type: String,
            required: false,
            default: null,
        },
        item: {
            type: String,
        },
        itemText: {
            type: String,
            default: 'name',
        },
        itemValue: {
            type: String,
            default: 'id',
        },
        itemChildren: {
            type: String,
            default: 'children',
        },
        displayOnly: {
            type: Boolean,
            default: false,
        },
        emptyText: {
            type: String,
            default: 'Unknown',
        },
        nestedItems: {
            type: Boolean,
            default: false,
        },
        spacingMultiplier: {
            type: Number,
            default: 3,
        },
        method: {
            type: String,
            default: 'POST',
            validator: (v) => {
                return ['post', 'put', 'patch', 'get'].includes(v.toLowerCase());
            },
        },
        confirmationFunction: {
            type: Function,
            default: () => {
                return new Promise((resolve) => {resolve()});
            },
        }
    },
    data() {
        if (this.url !== null && (this.rowItemId === null || this.field === null)) {
            throw new Error('When a url is specified, please provide a rowItemId and field');
        }
        return {
            loading: false,
            maxLevels: Math.floor(16 / this.spacingMultiplier),
        };
    },
    computed: {
        calculatedValue() {
            for (let item of this.internalItems) {
                if (item[this.itemValue] === this.value) {
                    return item;
                }
            }
            const defaultReturn = {};
            defaultReturn[this.itemValue] = -1;
            defaultReturn[this.itemText] = this.emptyText;
            return defaultReturn;
        },
        internalWidth() {
            if (this.width && this.width > 0) {
                let width = this.width + 'px';
                return {
                    'width': width,
                    'max-width': width,
                };
            }
            return {};
        },
        uri() {
            return this.url.replace(/{field}/g, this.field).replace(/{id}/g, this.rowItemId).replace(/{item}/g, this.item.camelToKebab());
        },
        internalItems() {
            return this.items;
        },
    },
    methods: {
        handleChange(event) {
            if (this.url === null) {
                this.$emit('change', event);
                return;
            }
            let confirmationFunction = () => { return new Promise((resolve) => {resolve()}) };
            if (this.confirmationFunction && typeof this.confirmationFunction === 'function') {
                confirmationFunction = this.confirmationFunction;
            }

            this.loading = true;
            let formData = new FormData();
            let varField = this.field.replace(/-/g, ' ').split(' ')?.map((f) => f.ucfirst()).join('').lcfirst();
            formData.append(varField, event ?? '');
            formData.append('id', this.rowItemId);

            this.$emit('change', {
                id: this.rowItemId,
                [varField]: event,
                initial: true,
            });

            confirmationFunction().then(() => {
                const method = this.method?.toLowerCase() || 'post';
                httpClient[method](this.uri, method === 'get' ? {} : formData).then(({data}) => {
                    let subData = data[this.item];

                    if (this.rowItemId === subData?.id || this.rowItemId === subData?.identifier) {
                        if (typeof subData === 'object') {
                            this.$emit('change', {
                                ...subData,
                                initial: false,
                            });
                        } else {
                            this.$emit('change', {
                                [this.item]: subData,
                                initial: false,
                            });
                        }
                    }
                }).catch((e) => {
                    this.$emit('error', {id: this.rowItemId, error: e});
                }).finally(() => {
                    this.loading = false;
                });
            }).catch((e) => {
                this.$emit('error', {id: this.rowItemId, error: e});
                this.loading = false;
            });
        },
    },
};
</script>
<style lang="scss" scoped>
.basic-select {
    font-size: 13px;
}

.table-select {
    display: inline-block;

    & ::v-deep > .v-input__control > .v-input__slot {
        padding: 0 6px !important;
        background: transparent !important;

        & > .v-select__slot > .v-select__selections {
            min-width: 60px;

            .v-select__selection {
                min-width: 100%;
                text-align: right;
            }

            input {
                display: none;
            }
        }
    }
}

.selected-option {
    text-align: left;
    font-size: 13px;
    padding-top: 4px;

    &.with-margin {
        margin-right: 28px;
    }
}
</style>
