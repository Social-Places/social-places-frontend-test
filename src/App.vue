<template>
    <div id="app">
        <sp-snackbar/>
        <router-view/>
    </div>
</template>
<script>

import SpSnackbar from "@/components/layout/SpSnackbar";
export default {
    name: 'App',
    components: {SpSnackbar},
    watch: {
        $route: {
            immediate: true,
            handler(toRoute) {
                if (toRoute?.meta?.isTab) {
                    return;
                }
                document.title = toRoute?.meta?.title || 'Social Places';
            },
        },
    },
};
</script>
<style>
.theme--light.v-application {
    background: #f8f9faff !important;
    color: rgba(0, 0, 0, 0.87) !important;
}

.theme--light.v-text-field--filled > .v-input__control > .v-input__slot {
    background: rgb(255, 255, 255) !important;
}

.container {
    padding-top: 0 !important;
}
</style>

