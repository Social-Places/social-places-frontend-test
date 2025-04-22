<script setup>
</script>

<template>
    <div class="flex justify-center">
        <a href="https://socialplaces.io/" target="_blank">
            <img alt="SP logo" class="logo h-[150px]" src="/sp-logo.png"/>
        </a>
    </div>
    <h1>Welcome!</h1>
    <div class="w-2/3 items-center m-auto py-5">
        <p class="my-2">
            We are Social Places; a local marketing software agency that provides listings, reputation, bookings and social interactions across multiple platforms and channels.
        </p>
        <p class="my-5">
            All steps are outlined in the project's <code><u>README</u></code>.
        </p>
        <p class="my-2">
            Good luck, and have fun!
        </p>
    </div>
</template>

<style scoped>
.logo {
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
}

.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
