<template>
    <v-app>
        <v-main class="main">
            <v-container fluid class="pa-0" style="height: 100%">
                <router-view/>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
export default {
    name: "PublicEntry",
}
</script>

<style scoped>

</style>
