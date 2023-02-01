<template>
    <v-row :class="{'theme--dark': $vuetify.theme.dark, 'theme--light': !$vuetify.theme.dark}" align="center" class="sticky table-bottom">
        <div
            v-if="enableBottomScrollbar"
            ref="bottomScroll"
            class="floating-scroll"
            @scroll="scrollTable">
            <div :style="`width: ${tableWidth}; height: 5px`"/>
        </div>
        <v-col :class="{'py-0': small}">
            <div class="text-xs-center">
                <v-pagination
                    v-model="page"
                    :class="{'small': small}"
                    :disabled="disabled"
                    :length="Math.ceil(totalItems / rowsPerPage)"
                    :total-visible="10"
                    class="pagination-footer"
                    color="primary"
                    elevation="0"
                    flat
                    next-icon="fas fa-chevron-right"
                    prev-icon="fas fa-chevron-left"/>
            </div>
        </v-col>
        <v-col align="right" md="auto">
            <v-btn fab x-small @click="top">
                <v-icon color="grey">
                    fas fa-chevron-up
                </v-icon>
            </v-btn>
        </v-col>
    </v-row>
</template>

<script>
export default {
    name: "FilterTableFooter",
    props: {
        eventPrefix: {
            type: String,
            default: null,
        },
        currentPage: null,
        totalItems: null,
        rowsPerPage: null,
        small: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        enableBottomScrollbar: {
            type: Boolean,
            default: false,
        },
        tableWidth: {
            type: String,
            default: '0px',
        },
        tableScrollLeft: {
            type: Number,
            default: 0,
        },
    },
    methods: {
        top() {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth',
            });
        },
        scrollTable() {
            if (this.enableBottomScrollbar) {
                this.$emit('update:tableScrollLeft', this.$refs.bottomScroll.scrollLeft);
            }
        },
    },
    watch: {
        tableScrollLeft() {
            if (this.enableBottomScrollbar) {
                this.$refs.bottomScroll.scrollLeft = this.tableScrollLeft;
            }
        },
    },
    computed: {
        page: {
            get() {
                return this.currentPage;
            },
            set(value) {
                this.$emit('update:currentPage', value);
            },
        },
    },
}
</script>

<style scoped lang="scss">
.table-bottom {
    margin-top: 1px !important;

    &.theme--dark {
        background: #121212DD;
    }

    &.theme--light {
        background: #f8f9faDD;
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
}

.sticky {
    position: -webkit-sticky;
    position: sticky;
    z-index: 3;
    bottom: 0;
}

.pagination-footer.small ::v-deep {
    & > .v-pagination > li {
        & > .v-pagination__navigation {
            background: transparent;
            box-shadow: none;
            min-width: 25px;
            height: 25px;
            margin: 0.1rem 10px;
            border: 1px solid transparent;
            transition: border-color 500ms, color 500ms;

            &:hover {
                border-color: var(--v-primary-base) !important;

                & > .v-icon {
                    color: var(--v-primary-base) !important;
                }
            }

            &:focus {
                outline: none;
            }
        }

        & > .v-pagination__item:not(.v-pagination__item--active) {
            background: transparent;
            box-shadow: none;

            &:hover {
                border-color: var(--v-primary-base) !important;
                color: var(--v-primary-base) !important;
            }
        }

        & > .v-pagination__item {
            font-size: 12px !important;
            min-width: 25px;
            height: 25px;
            margin: 0.1rem;
            border: 1px solid transparent;
            transition: border-color 500ms, color 500ms;
            outline: none;
        }
    }
}
</style>
