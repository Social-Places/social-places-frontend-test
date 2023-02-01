<template>
    <div>
        <v-snackbar
            v-for="(snackbar, i) in shownSnackbars"
            :key="snackbar.key"
            :ref="`snackbar-${i}`"
            :bottom="snackbar.y === 'bottom'"
            :color="snackbar.type"
            :left="x === 'left'"
            :multi-line="snackbar.mode === 'multi-line'"
            :right="x === 'right'"
            :style="{'margin-top': calculateMargin(i)}"
            :timeout="snackbar.timeout"
            :top="y === 'top'"
            :value="true"
            :vertical="snackbar.mode === 'vertical'"
            @input="hidden(i)">
            <span v-html="snackbar.text"/>
            <template #action>
                <v-btn class="mr-2" dark icon text @click="hidden(i)">
                    <v-icon>fas fa-times</v-icon>
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script>

import {serverBus} from "@/main";

export default {
    name: "SpSnackbar",
    data() {
        return {
            snackbars: [],
            shownSnackbars: [],
            x: 'right',
            y: 'top',
            sessionEntry: 0,
        }
    },
    created() {
        serverBus.$on('alert', this.handleAlert)

        this.$once('hook:beforeDestroy', () => {
            serverBus.$off('alert', this.handleAlert)
        });
    },
    methods: {
        handleAlert(alert) {
            if (!alert.text) {
                return;
            }
            const defaultedAlert = Object.assign({
                text: '',
                type: 'error',
                mode: '',
                timeout: 6000,
                key: this.sessionEntry,
            }, alert);
            this.sessionEntry++;
            if (this.shownSnackbars.length < 3) {
                setTimeout(() => {
                    this.shownSnackbars.push(defaultedAlert);
                }, 1)
            } else {
                this.snackbars.push(defaultedAlert);
            }
        },
        hidden(item) {
            this.shownSnackbars.splice(item, 1);
            if (this.snackbars.length > 0 && this.shownSnackbars.length < 3) {
                this.shownSnackbars.push(this.snackbars.shift());
            }
        },
        calculateMargin(item) {
            if (item === 0) {
                return '0px';
            }

            const concernedItem = item - 1;
            const concernedRef = this.$refs[`snackbar-${concernedItem}`].last();
            const concernedHeight = concernedRef.$el.children[0].clientHeight + (2 * 8);
            const concernedOffset = parseInt(concernedRef.$el.style.marginTop.replace('px', ''));

            return (concernedHeight + concernedOffset) + 'px';
        },
    },
}
</script>

<style lang="scss" scoped>
.v-snack ::v-deep .v-snack__action {
    padding-right: 4px;
}
</style>
