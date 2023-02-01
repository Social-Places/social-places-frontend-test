<template>
    <div :align="alignButtons">
        <v-tooltip v-for="(exportBtn, key) in exportButtonArray"
                   :key="key"
                   :bottom="exportBtn.tooltipBottom"
                   :top="exportBtn.tooltipTop"
                   :right="exportBtn.tooltipRight"
                   :left="exportBtn.tooltipLeft">
            <template #activator="{ on, attrs }">
                <v-btn :color="exportBtn.color ? exportBtn.color : 'primary'"
                       :icon="exportBtn.iconOnly"
                       v-bind="attrs"
                       v-on="on"
                       @click="download(exportBtn.url)">
                    <span v-if="!exportBtn.iconOnly && exportBtn.text && exportBtn.textPosition === 'start'"
                          v-html="exportBtn.text"
                          class="mr-3"/>
                    <v-icon v-if="exportBtn.iconClass">
                        {{ exportBtn.iconClass }}
                    </v-icon>
                    <span v-if="!exportBtn.iconOnly && exportBtn.text && exportBtn.textPosition === 'end'"
                          v-html="exportBtn.text"
                          class="ml-3"/>
                </v-btn>
            </template>
            <span v-if="exportBtn.name">Export to {{ exportBtn.name }}</span>
        </v-tooltip>
        <v-dialog
            v-model="loadingDialog"
            persistent
            width="300">
            <v-card
                color="darkPrimary"
                dark>
                <v-card-text align="center">
                    Downloading Export
                    <v-progress-linear
                        indeterminate
                        color="white"
                        class="mb-0"/>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import httpClient from "@/classes/httpClient";

/**
 * exportButtonArray - will post filter data to URL
 * [
 *  {
 *      id: 'excelExport',
        iconOnly: true,
        iconClass: 'fal fa-file-excel',
        url: 'path to download',
        name: 'Excel',
        tooltipBottom: true,
        event: true // will send a event if clicked
 *  }
 * ]
 */
export default {
    name: 'ExportButtons',
    props: {
        alignButtons: {
            type: String,
            default: 'end',
        },
        exportButtonArray: {
            type: Array,
            default: () => [],
            required: true,
        },
        search: {
            type: String,
            default: null,
        },
        eventPrefix: {
            type: String,
            default: null,
        },
        sortBy: null,
        sortDesc: null,
        filterData: {
            type: Object
        }
    },
    data() {
        return {
            loadingDialog: false,
            warningDialog: false,
            infoDialog: false,
        };
    },
    methods: {
        cancel() {
            this.warningDialog = false;
            this.infoDialog = false;
            this.loadingDialog = false;
        },
        download(url) {
            this.loadingDialog = true;
            httpClient.processExportDownload(url, {
                filters: this.filterData,
                data: {
                    search: this.search,
                    sortBy: this.sortBy,
                    sortDesc: this.sortDesc,
                },
            }).then(() => {
            }).catch(() => {}).finally(this.cancel).finally(() => {
                this.loadingDialog = false;
            });
        },
    },
};
</script>
<style scoped>
</style>
