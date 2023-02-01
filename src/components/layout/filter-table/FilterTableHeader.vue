<template>
    <v-row :class="{'theme--dark': $vuetify.theme.dark, 'theme--light': !$vuetify.theme.dark}" align="center" class="sticky table-top">
        <v-col md="auto">
            <span class="middle inverse-text">
                {{ showing }}
            </span>
        </v-col>
        <v-spacer/>
        <v-col v-if="exportButtonArray" align="right" md="auto">
            <export-buttons
                :event-prefix="eventPrefix"
                :export-button-array="exportButtonArray"
                :filter-data="filterData"
                :search="search"
                :sort-by="sortBy"
                :sort-desc="sortDesc"/>
        </v-col>
        <v-col v-for="(action,index) of actions" :key="index" align="right" md="auto">
            <bit-btn
                v-if="action.type === 'icon'"
                :disabled="action.disabled || false"
                :icon="action.icon"
                :loading="action.loading || false"
                :tooltip="action.tooltip"
                bottom
                @click="actionClick(action)"/>
            <v-tooltip v-else-if="action.tooltip" bottom>
                <template #activator="{on}">
                    <div style="display: inline-block" v-on="on">
                        <v-btn
                            :disabled="action.disabled || false"
                            :loading="action.loading || false"
                            color="primary"
                            outlined
                            @click="actionClick(action)">
                            <v-icon v-if="action.icon" left>{{ action.icon }}</v-icon>
                            {{ action.name }}
                        </v-btn>
                    </div>
                </template>
                <span v-html="action.tooltip"/>
            </v-tooltip>
            <v-btn
                v-else
                :disabled="action.disabled || false"
                :loading="action.loading || false"
                color="primary"
                outlined
                @click="actionClick(action)">
                <v-icon v-if="action.icon" left>{{ action.icon }}</v-icon>
                {{ action.name }}
            </v-btn>
        </v-col>
        <v-col v-if="createRoute || createAction" align="right" md="auto">
            <router-link v-if="createRoute" :to="{name: createRoute}">
                <v-btn
                    color="primary"
                    outlined>
                    {{ createRouteEntityLabel }}
                </v-btn>
            </router-link>
            <v-tooltip v-if="createActionTooltip" bottom>
                <template #activator="{on}">
                    <div style="display: inline-block" v-on="on">
                        <v-btn
                            :disabled="createActionDisabled"
                            color="primary"
                            outlined
                            @click="createAction">
                            {{ createActionEntityLabel }}
                        </v-btn>
                    </div>
                </template>
                <span v-html="createActionTooltip"/>
            </v-tooltip>
            <v-btn v-else-if="createAction"
                   color="primary"
                   outlined
                   @click="createAction">
                {{ createActionEntityLabel }}
            </v-btn>
        </v-col>
        <v-col v-if="!noPaging" align="right" md="auto">
            <span :class="{'white--text': $vuetify.theme.dark, 'black--text': !$vuetify.theme.dark}" class="middle">Show</span>
            <v-select
                v-model="internalRowsPerPage"
                :items="rowsPerPageItems"
                class="d-inline-block ml-2"
                dense
                flat
                hide-details
                solo
                style="max-width: 100px"/>
        </v-col>
        <div
            v-if="enableTopScrollbar"
            ref="topScroll"
            class="floating-scroll"
            @scroll="scrollTable">
            <div :style="`width: ${tableWidth}; height: 5px`"/>
        </div>
    </v-row>
</template>

<script>
import BitBtn from "@/components/general/BitBtn";
import ExportButtons from "@/components/general/ExportButtons";

export default {
    name: "FilterTableHeader",
    components: {ExportButtons, BitBtn},
    props: {
        filterData: {
            type: Object,
            default: () => ({})
        },
        eventPrefix: {
            type: String,
            default: null,
        },
        createRoute: {
            type: String,
            default: '',
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
        exportButtonArray: {
            type: Array,
            default: () => [],
        },
        noPaging: {
            type: Boolean,
            default: false
        },
        loading: {
            type: Boolean,
            default: true
        },
        totalItems: null,
        rowsPerPage: null,
        currentPage: null,
        rowsPerPageItems: null,
        currentTableMode: null,
        enableTopScrollbar: {
            type: Boolean,
            default: false,
        },
        tableWidth: {
            type: String,
            default: '0px',
        },
        search: {
            type: String,
            default: null,
        },
        tableScrollLeft: {
            type: Number,
            default: 0,
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
        sortBy: null,
        sortDesc: null,
    },
    computed: {
        showing() {
            if (this.loading) {
                return 'Loading...';
            }

            if (this.totalItems === 0) {
                return 'No Results';
            }

            if (this.noPaging) {
                return 'Showing ' + this.totalItems + ' Results';
            }

            return 'Showing ' +
                (this.totalItems <
                (this.rowsPerPage + ((this.currentPage - 1) * this.rowsPerPage)) ?
                    (1 +
                        ((this.currentPage - 1) * this.rowsPerPage)) + ' - ' +
                    this.totalItems :
                    (1 +
                        ((this.currentPage - 1) * this.rowsPerPage)) + ' - ' +
                    (this.rowsPerPage +
                        ((this.currentPage - 1) * this.rowsPerPage))) + ' of ' +
                this.totalItems;
        },
        theme() {
            return (this.$vuetify.theme.dark) ? 'dark' : 'light';
        },
        createRouteEntityLabel() {
            return this.createRouteLabel ?? `Create ${this.entityLabel}`;
        },
        createActionEntityLabel() {
            return this.createActionLabel ?? `Create ${this.entityLabel}`;
        },
        internalRowsPerPage: {
            get() {
                return this.rowsPerPage;
            },
            set(value) {
                this.$emit('update:rowsPerPage', value);
                this.$nextTick(() => {
                    this.$emit('update:currentPage', 1);
                });
            },
        },
    },
    methods: {
        actionClick(actionItem) {
            if (actionItem.action) {
                actionItem.action();
                return;
            }
            if (actionItem.route) {
                this.$router.push(actionItem.route);
            }
        },
        scrollTable() {
            if (this.enableTopScrollbar) {
                this.$emit('update:tableScrollLeft', this.$refs.topScroll.scrollLeft);
            }
        },
    },
}
</script>
<style lang="scss" scoped>
.table-top {
    &.theme--dark {
        background: #121212dd;
    }

    &.theme--light {
        background: #f8f9fadd;
    }
}

.floating-scroll {
    width: 100%;
    height: 5px;
    overflow-x: auto;
    overflow-y: hidden;
    margin: 0 12px;
}

.middle {
    vertical-align: middle;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.38);
}

.sticky {
    position: -webkit-sticky; /* Safari */
    position: sticky;
    z-index: 3;
    top: 0;
}

.v-application a {
    text-decoration: none !important;
}

.v-btn-toggle:not(.v-btn-toggle--dense) .v-btn.v-btn.v-size--default.table-mode-header-button {
    height: 36px;
    min-width: 36px;
    padding: 0 9px;
}
</style>
