<template>
    <v-container fluid tag="section">
        <filter-block
            :event-prefix="eventPrefix"
            :filter-url="filterUrl"
            :inline-filter="inlineFilter"
            :loading="loading"
            @filter="query"/>
        <v-container fluid style="position: relative">
            <filter-table-header
                :actions="actions"
                :create-action-disabled="createActionDisabled"
                :create-action-tooltip="createActionTooltip"
                :current-page.sync="page"
                :enable-top-scrollbar="hasTopScrollbar"
                :event-prefix="eventPrefix"
                :loading="loading"
                :filter-data="currentFilters"
                :rows-per-page.sync="rowsPerPage"
                :rows-per-page-items="rowsPerPageItems"
                :search="search"
                :table-scroll-left.sync="tableScrollLeft"
                :table-width="tableWidth"
                :total-items="totalItems"
                v-bind="$props"/>
            <div style="position: relative">
                <v-data-table
                    ref="vDataTable"
                    :class="{'has-bottom-scrollbar': hasBottomScrollbar}"
                    :footer-props="{itemsPerPageOptions: rowsPerPageItems}"
                    :headers="allHeadings"
                    :item-class="itemClass"
                    :items="items"
                    :items-per-page="rowsPerPage"
                    :loading="loading"
                    :server-items-length="totalItems"
                    :sort-by.sync="sortBy"
                    :sort-desc.sync="sortByDescending"
                    class="elevation-1"
                    hide-default-footer>
                    <template v-for="headerItem in unscopedHeaderSlots" #[`header.${headerItem.value}`]="{ header }">
                        <v-tooltip v-if="header && header.tooltip" :key="`header.${headerItem.value}`" bottom>
                            <template #activator="{on}">
                                <span v-on="on" v-html="header.text"/>
                            </template>
                            <span v-html="header.tooltip"/>
                        </v-tooltip>
                        <span v-else :key="`header.${headerItem.value}`" v-html="header.text" />
                    </template>
                    <template v-for="field in tableSlots" #[field]='allProps'>
                        <slot :name="field" v-bind="allProps"/>
                    </template>
                    <template v-for="unscopedDateField in unscopedDateSlots" #[`item.${unscopedDateField}`]='allProps'>
                        <span :key="`${unscopedDateField}-a`" class="no-whitespace">{{ allProps.item[unscopedDateField] | formatDate('dd MMM \'yy') }}</span>
                        <br :key="`${unscopedDateField}-br`"/>
                        <span :key="`${unscopedDateField}-c`" class="no-whitespace">{{ allProps.item[unscopedDateField] | formatDate('HH:mm') }}</span>
                    </template>
                    <template slot="no-data">
                        {{ noDataText }}
                    </template>
                </v-data-table>
                <div :style="{'width': scrollLeft}" class="scroller left"/>
                <div :style="{'width': scrollRight}" class="scroller right"/>
            </div>
            <filter-table-footer
                :current-page.sync="page"
                :disabled="loading"
                :enable-bottom-scrollbar="hasBottomScrollbar"
                :event-prefix="eventPrefix"
                :rows-per-page="rowsPerPage"
                :table-scroll-left.sync="tableScrollLeft"
                :table-width="tableWidth"
                :total-items="totalItems"
                small
                v-bind="$props"/>
            <slot name="below-table"/>
        </v-container>
    </v-container>
</template>

<script>
import FilterTableHeader from "@/components/layout/filter-table/FilterTableHeader";
import FilterTableFooter from "@/components/layout/filter-table/FilterTableFooter";
import httpClient from "@/classes/httpClient";
import FilterBlock from "@/components/layout/filter-table/FilterBlock";

export default {
    name: "FilterTable",
    components: {FilterBlock, FilterTableFooter, FilterTableHeader},
    props: {
        createRoute: {
            default: null,
        },
        createAction: {
            type: Function,
        },
        createRouteLabel: {
            default: null,
        },
        createActionLabel: {
            default: null,
        },
        createActionTooltip: {
            type: String,
        },
        createActionDisabled: {
            type: Boolean,
            default: false,
        },
        entityLabel: {
            default: '',
        },
        escapeHeaders: {
            default: false,
            type: Boolean,
        },
        filterUrl: {
            type: String,
            default: null,
        },
        filterComponentArray: {
            type: String,
            default: null,
        },
        storeMethodProp: {
            type: String,
            default: null,
        },
        inlineFilter: {
            type: Boolean,
            default: false,
        },
        showRefreshBtn: {
            type: Boolean,
            default: true,
        },
        tableApiUrl: {
            type: String,
            required: true,
        },
        noDataText: {
            type: String,
            default: 'Nothing to see here',
        },
        loadFilter: {
            type: Boolean,
            default: true,
        },
        exportButtonArray: {
            type: Array,
            default: () => [],
        },
        itemClass: {
            type: [Function, String],
            default: () => {
            },
        },
        skipTable: {
            type: Boolean,
            default: false,
        },
        hasTopScrollbar: {
            type: Boolean,
            default: true,
        },
        hasBottomScrollbar: {
            type: Boolean,
            default: true,
        },
        actions: {
            type: Array,
            validator: (values) => {
                for (let value of values) {
                    if (!value.hasOwnProperties(['name', 'action']) && !value.hasOwnProperties(['name', 'route'])) {
                        return false;
                    }
                }
                return true;
            },
            default: () => [],
        },
    },
    data() {
        return {
            search: '',
            sortByDescending: [],
            headers: [],
            page: 1,
            rowsPerPage: 10,
            sortBy: [],
            totalItems: 0,
            rowsPerPageItems: [10, 25, 50, 100],
            initial: true,
            viewAsManager: true,
            items: [],
            shadowItems: {},
            filterData: [],
            loading: true,
            columns: [],
            cancelToken: null,
            scrollLeft: 0,
            scrollRight: 0,
            tableWidth: '0px',
            tableScrollLeft: 0,
            currentFilters: {}
        };
    },
    mounted() {
        const wrapper = this.$refs.vDataTable?.$el.children[0];
        const updateScrollPos = () => {
            let widthDiff = wrapper.scrollWidth - wrapper.clientWidth;
            let left = 0;
            let right = 0;
            if (widthDiff > 0) {
                left = wrapper.scrollLeft / widthDiff;
                right = 1 - left;

                left = Math.round(left * 1000) / 100; //wanting a range from 0-10 with 2 decimal precision
                right = Math.round(right * 1000) / 100; //wanting a range from 0-10 with 2 decimal precision
            }

            this.scrollLeft = left + '%';
            this.scrollRight = right + '%';
            this.tableWidth = wrapper.children[0]?.clientWidth + 'px';
            this.tableScrollLeft = wrapper.scrollLeft;
        };
        if (wrapper) {
            let observer = undefined;
            try {
                observer = new ResizeObserver(updateScrollPos);
                observer.observe(wrapper);
            } catch (e) {
                console.log(e);
                // ignore
            }
            wrapper.addEventListener('scroll', () => {
                updateScrollPos();
            });

            this.$once('hook:beforeDestroy', () => {
                wrapper.removeEventListener('scroll', updateScrollPos);
                if (observer !== undefined) {
                    try {
                        observer.disconnect();
                    } catch (e) {
                        // ignore
                    }
                }
            });
        }
    },
    computed: {
        eventPrefix() {
            return `v-table:${this.id}`;
        },
        headings() {
            if (this.headers.length === 0) {
                return this.columns;
            }
            return this.headers;
        },
        allHeadings() {
            let headings = this.headings;
            if (this.actionsIsUnscoped) {
                headings = headings.filter((heading) => heading.value !== 'actions')
            }
            if (this.internalSelectedGroups) {
                headings = headings.filter((heading) => !heading.groups || heading.groups.length === 0 || (Array.isArray(this.internalSelectedGroups) && this.internalSelectedGroups.some((group) => heading.groups.includes(group))) || (typeof this.internalSelectedGroups === 'string' && heading.groups.includes(this.internalSelectedGroups)));
            }

            return headings;
        },
        actionsIsUnscoped() {
            return !this.tableSlots.includes('item.actions');
        },
        tableSlots() {
            return Object.keys(this.$scopedSlots);
        },
        unscopedDateSlots() {
            const existingSlots = this.tableSlots;
            return this.allHeadings.filter((heading) => heading.value.indexOf('date') === 0 && !existingSlots.includes(`item.${heading.value}`)).map((heading) => heading.value);
        },
        unscopedHeaderSlots() {
            const existingSlots = this.tableSlots;
            return this.allHeadings.filter((heading) => !existingSlots.includes(`header.${heading.value}`));
        },
    },
    watch: {
        tableScrollLeft() {
            const wrapper = this.$refs.vDataTable?.$el.children[0];
            wrapper.scrollLeft = this.tableScrollLeft;
        },
        page() {
            this.$nextTick(() => {
                this.query(this.currentFilters);
            });
        },
        sortByDescending() {
            if (this.page !== 1) {
                this.page = 1;
            } else {
                this.$nextTick(() => {
                    this.query(this.currentFilters);
                });
            }
        }
    },
    methods: {
        query(filters = {}) {
            this.loading = true;
            this.currentFilters = filters;
            httpClient.post(this.tableApiUrl, {
                sortBy: this.sortBy,
                sortDesc: this.sortByDescending,
                page: this.page,
                rowsPerPage: this.rowsPerPage,
                totalItems: this.totalItems,
                rowsPerPageItems: this.rowsPerPageItems,
                initial: this.initial,
                filters: JSON.stringify(filters),
            }).then(({data}) => {
                this.items = data.data;
                this.totalItems = data.total;
                this.columns = data.columns ?? [];
                this.page = data.current_page ?? this.page;
                this.rowsPerPageItems = data.rows_per_page_item ?? this.rowsPerPageItems;
                this.rowsPerPage = data.per_page ?? this.rowsPerPage;

                if (this.initial) {
                    this.sortBy = data.sort_by ?? this.sortBy;
                    this.sortBy = data.sort_by_desc ?? this.sortByDescending;
                    this.search = data.search ?? this.search;
                    this.initial = false;
                }
            }).finally(() => {
                this.loading = false;
            })
        },
        setTableRow(payload) {
            let foundItem = this.items.find((item) => {
                return item.id === payload.id || item.identifier === payload.id;
            });
            if (foundItem === undefined) {
                return;
            }

            this.shadowItems[foundItem.id] = Object.assign({}, foundItem);
            for (let key of Object.keys(foundItem)) {
                if (payload.hasOwnProperty(key)) { // mitigates if the foundItem has values that the payload does note
                    foundItem[key] = payload[key];
                }
            }
        },
        setTableRowProperty(payload) {
            const {id, property, values} = payload;
            let foundItem = this.items.find((item) => {
                return item.id === id || item.identifier === id;
            });
            if (foundItem === undefined) {
                return;
            }
            this.shadowItems[foundItem.id] = Object.assign({}, foundItem);
            foundItem[property] = values;
        },
        resetTableRow({id}) {
            console.log(this.shadowItems, id);
            if (this.shadowItems.hasOwnProperty(id)) {
                this.setTableRow(this.shadowItems[id]);
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.v-data-table.has-bottom-scrollbar ::v-deep > .v-data-table__wrapper::-webkit-scrollbar {
    height: 0;
}

.scroller {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 7;
    pointer-events: none;
    transition: width 250ms;

    &.right {
        right: 0;
    }

    &.left {
        left: 0;
    }
}

.theme--light {
    & .scroller {
        &.right {
            background: linear-gradient(to left, #8080804a, transparent);
        }

        &.left {
            background: linear-gradient(to right, #8080804a, transparent);
        }
    }
}

.theme--dark {
    & .scroller {
        &.right {
            background: linear-gradient(to left, #313131aa, transparent);
        }

        &.left {
            background: linear-gradient(to right, #313131aa, transparent);
        }
    }
}
</style>
