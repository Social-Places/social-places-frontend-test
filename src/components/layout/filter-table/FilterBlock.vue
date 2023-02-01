<template>
    <div>
        <v-row v-for="(filterChunk, idx) in filterChunks" :key="`filter-${idx}-chunk`">
            <v-col :cols="multipleOfFour ? 11 : 12" class="row">
                <v-col
                    v-for="(filter, colIdx) in filterChunk"
                    cols="3"
                    :key="`filter-${idx}-${colIdx}`">
                    <component
                        v-model="filter.values"
                        :is="getFilterType(filter)"
                        :filter="filter"/>
                </v-col>
                <v-col
                    v-if="!multipleOfFour && (filterChunks.length - 1) === idx"
                    cols="1">
                    <v-btn
                        :loading="loading || filtersLoading"
                        class="mr-2"
                        color="primary"
                        elevation="2"
                        fab
                        small
                        @click.stop="handleFiltered">
                        <v-icon dark small>fas fa-arrow-right</v-icon>
                    </v-btn>
                </v-col>
            </v-col>
            <v-col v-if="multipleOfFour && (filterChunks.length - 1) === idx"
                   cols="1"
                   style="align-self: center;">
                <v-btn
                    :loading="loading || filtersLoading"
                    class="mr-2"
                    color="accent"
                    elevation="2"
                    fab
                    small
                    @click.stop="handleFiltered">
                    <v-icon dark small>fas fa-arrow-right</v-icon>
                </v-btn>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import httpClient from "@/classes/httpClient";
import AutocompleteFilter from "@/components/layout/filter-table/filters/AutocompleteFilter";
import _ from 'lodash';

export default {
    name: "FilterBlock",
    components: {AutocompleteFilter},
    props: {
        eventPrefix: {
            type: String,
            default: null
        },
        filterUrl: {
            type: String,
            required: true,
        },
        hideRefreshButton: {
            type: Boolean,
            default: false,
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            filtersLoading: false,
            filters: [],
        }
    },
    computed: {
        filterChunks() {
            if (!this.filters) {
                return [];
            }

            return _.chunk(this.filters, 4);
        },
        multipleOfFour() {
            if (!this.filters) {
                return false;
            }
            return this.filters.length % 4 === 0;
        },
    },
    created() {
        this.loadFilters();
    },
    methods: {
        loadFilters() {
            if (!this.filterUrl) {
                this.handleFiltered();
                return;
            }

            this.filtersLoading = true;
            httpClient.get(this.filterUrl).then(({data}) => {
                this.filters = data;
            }).finally(() => {
                this.handleFiltered();
                this.filtersLoading = false;
            });
        },
        getFilterType(filter) {
            if (filter.type) {
                return filter.type.ucfirst() + 'Filter';
            }
            return 'AutocompleteFilter';
        },
        handleFiltered() {
            let filtersToSend = {};
            this.filters.filter((filter) => {
                if (Array.isArray(filter.values) && filter.values.length > 0) {
                    filtersToSend[filter.name] = filter.values;
                    return;
                }
                if (!Array.isArray(filter.values) && filter.values) {
                    filtersToSend[filter.name] = filter.values;
                }
            })

            this.$emit('filter', filtersToSend);
        }
    }
}
</script>

<style scoped>

</style>
