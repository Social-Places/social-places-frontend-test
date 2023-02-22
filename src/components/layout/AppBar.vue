<template>
    <v-app-bar absolute app class="app-bar pad-toolbar" color="transparent" flat height="72" >
        <v-btn
            color="primary"
            fab
            height="40px"
            width="40px"
            @click="changeSidebarState">
            <v-icon data-testid="icon">{{ sideBarStateIcon }}</v-icon>
        </v-btn>
        <div class="d-flex flex-column pl-8">
            <v-toolbar-title class="font-weight-bold primary--text" v-text="pageHeading"/>
            <v-breadcrumbs :items="breadCrumbs" class="breadcrumbs"/>
        </div>
        <v-spacer/>
        <v-btn
            :loading="loggingOut"
            height="40"
            icon
            width="40"
            @click="logout">
            <v-icon color="grey">fas fa-sign-out-alt</v-icon>
        </v-btn>
    </v-app-bar>
</template>

<script>
// import httpClient from "@/classes/httpClient";

import {wait} from "@/helpers/build-functions";

export default {
    name: "AppBar",
    props: {
        sideBarState: {
            type: String,
            default: 'full',
        },
    },
    data() {
        return {
            loggingOut: false,
        }
    },
    computed: {
        sideBarStateIcon() {
            switch (this.sideBarState) {
                case 'none':
                    return 'fas fa-bars';
                case 'mini':
                    return 'fas fa-times';
                case 'full':
                default:
                    return 'fas fa-list-ul';
            }
        },
        pageHeading() {
            return this.$route?.meta?.header || '';
        },
        breadCrumbs() {
            let routes = [{
                text: 'Dashboard',
                // href: match.path,
                to: {name: 'Dashboard'},
                exact: true,
                disabled: 'Dashboard' === this.$route?.name,
            }];

            if (typeof this.$route === "undefined") {
                return routes;
            }

            if (this.$route?.name !== 'Dashboard') {
                for (let matched of this.$route.matched) {
                    if (matched.name?.indexOf('Entry') !== -1 || matched.name?.indexOf('Index') !== -1) {
                        continue;
                    }
                    routes.push({
                        text: matched?.meta.header,
                        // href: matched.path,
                        to: {name: matched.redirect ?? matched.name},
                        exact: true,
                        disabled: matched.name === this.$route.name,
                    })
                }
            }

            return routes;
        }
    },
    methods: {
        changeSidebarState() {
            switch (this.sideBarState) {
                case 'none':
                    this.$emit('update:sideBarState', 'full');
                    break;
                case 'mini':
                    this.$emit('update:sideBarState', 'none');
                    break;
                case 'full':
                default:
                    this.$emit('update:sideBarState', 'mini');
                    break;
            }
        },
        async logout() {
            this.loggingOut = true;
            try {
                // await httpClient.post('api_logout');
                await wait(1500);
                await this.$router.push('login');
            } finally {
                this.loggingOut = false;
            }
        },
    },
}
</script>

<style scoped>
    .pad-toolbar {
        padding-right: 16px;
    }

    .breadcrumbs {
        padding: 0!important;
    }
</style>
