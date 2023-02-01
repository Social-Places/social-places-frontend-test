<template>
    <v-autocomplete
        v-model="internalValue"
        :items="items"
        :label="filter.label"
        :loading="loading"
        :multiple="filter.multiple"
        clearable
        color="primary"
        deletable-chips
        dense
        flat
        filled
        outlined
        hide-details
        item-color="primary"
        item-text="name"
        item-value="id"
        class="autocomplete-filter  filter"
        rounded
        small-chips
        :search-input.sync="searchInput"
        @input="searchInput=null">
        <template #selection="{ attrs, item, parent, selected }">
            <v-chip v-if="item === Object(item)" :input-value="selected" color="primary" label outlined small v-bind="attrs"
                    @click="selectItem(parent, item)">
                <span class="pr-2">{{ item.name }}</span>
                <v-icon color="primary" small>fas fa-times</v-icon>
            </v-chip>
        </template>
    </v-autocomplete>
</template>

<script>
import httpClient from "@/classes/httpClient";
import "@/scss/filters/filters.scss";

export default {
    name: "AutocompleteFilter",
    props: {
        filter: {
            type: Object,
        },
        value: {
            type: [Array, String, Number]
        }
    },
    data() {
        return {
            loading: false,
            items: [],
            searchInput: null,
        }
    },
    mounted() {
        this.init();
    },
    computed: {
        internalValue: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value);
            }
        }
    },
    methods: {
        init() {
            if (!this.filter.url) {
                this.items = this.filter.data;
                return;
            }

            httpClient.post(this.filter.url).then(({data}) => {
                this.items = data;
            });
        },
        selectItem(parent, item) {
            parent.selectItem(item);
        },
    },
}
</script>

<style scoped lang="scss">
@import "@/scss/filters/filters";
.autocomplete-filter ::v-deep {
    & > .v-input__control {
        & > .v-input__slot {
            margin-bottom: 2px;

            & > .v-select__slot > .v-select__selections {
                margin-top: 5px;

                & > input {
                    padding: 2px 0;
                }
            }

            & > .v-input__prepend-inner {
                margin-top: 12px;
            }
        }
    }

    .v-input--is-disabled:not(.v-input--is-readonly) {
        pointer-events: none;
    }
}
</style>
