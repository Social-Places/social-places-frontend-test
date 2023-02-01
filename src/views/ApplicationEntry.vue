<template>
    <v-app>
        <navigation-drawer :side-bar-state="sideBarState"/>
        <app-bar :side-bar-state.sync="sideBarState"/>
        <v-main class="main">
            <v-container fluid class="pa-0" style="height: 100%">
                <router-view/>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import NavigationDrawer from "@/components/layout/NavigationDrawer";
import AppBar from "@/components/layout/AppBar";

export default {
    name: "ApplicationEntry",
    components: {AppBar, NavigationDrawer},
    data() {
        return {
            sideBarState: 'full'
        }
    }

}
</script>

<style scoped>

</style>
