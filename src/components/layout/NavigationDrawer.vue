<template>
    <v-navigation-drawer
        ref="navDrawer"
        :mini-variant="miniVariant"
        :value="drawer"
        app
        color="darkPrimary"
        dark
        mini-variant-width="64"
        width="256">
        <div v-if="loadingNavigationDrawerLinks">
            <v-skeleton-loader
                type="list-item-avatar-two-line"/>
            <v-skeleton-loader
                class="mt-2 mb-5"
                type="divider"/>
            <v-skeleton-loader
                v-for="i in 2"
                :key="i+'_second'"
                class="mt-2 mb-2"
                type="list-item-avatar"/>
            <v-skeleton-loader
                class="mt-5 mb-5"
                type="divider"/>
            <v-skeleton-loader
                v-for="i in 6"
                :key="i+'_first'"
                class="mt-2 mb-2"
                type="list-item-avatar"/>
        </div>
        <v-list v-else class="py-0 d-flex flex-column" dense nav>
            <v-list-item
                class="px-0"
                two-line>
                <v-list-item-avatar
                    :color="user.fullname.colorOnLength()">
                    <img
                        v-if="!profilePictureBroken && user.profilePicture !== null"
                        :src="user.profilePicture"
                        alt="Profile Image"
                        @error="profilePictureBroken = true"/>
                    <span v-else>{{ user.fullname.initialize() }}</span>
                </v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title>{{ user.fullname }}</v-list-item-title>
                    <v-list-item-subtitle>{{ user.primaryRole }}</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-divider class="mb-1"/>
            <template v-for="(link, idx) in links">
                <v-divider v-if="link.divider" :key="idx" class="my-1"/>
                <tooltip-holder
                    v-else
                    :key="idx"
                    :disabled="!miniVariant"
                    :tooltip="link.name"
                    right>
                    <v-list-item
                        :to="link.path"
                        class="my-1"
                        link>
                        <v-list-item-icon>
                            <v-icon>{{ link.icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title class="font-weight-thin" style="white-space: break-spaces" v-html="link.name"/>
                        </v-list-item-content>
                    </v-list-item>
                </tooltip-holder>
            </template>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import httpClient from "@/classes/httpClient";
import TooltipHolder from "@/components/general/TooltipHolder";

export default {
    name: "NavigationDrawer",
    components: {TooltipHolder},
    props: {
        sideBarState: {
            type: String,
            default: 'full',
        },
    },
    data() {
        return {
            loadingNavigationDrawerLinks: false,
            dashboard: 'manager',
            profilePictureBroken: false,
            user: {
                fullname: '',
                primaryRole: '',
                profilePicture: null,
            },
            links: [
                {
                    icon: 'fas fa-tachometer',
                    name: 'Dashboard',
                    path: '/dashboard'
                },
                {
                    icon: 'fas fa-user',
                    name: 'Profile',
                    path: '/profile'
                }
            ],
        }
    },
    computed: {
        drawer() {
            return this.sideBarState !== 'none';
        },
        miniVariant() {
            return this.sideBarState === 'mini';
        },
    },
    watch: {},
    async created() {
        await this.init()
    },
    methods: {
        async init() {
            this.loadingNavigationDrawerLinks = true;

            let promises = [
                httpClient.get('https://dummyjson.com/users').then(({data: {users}}) => {
                    let user = users[Math.floor(Math.random() * users.length)];
                    this.user = {
                        fullname: `${user.firstName} ${user.lastName}`,
                        primaryRole: `@${user.username}`,
                        profilePicture: user.image
                    }
                }),
            ];
            await Promise.all(promises);

            this.loadingNavigationDrawerLinks = false;
        },
    },
}
</script>

<style lang="scss" scoped>
.v-skeleton-loader ::v-deep > {
    .v-skeleton-loader__list-item-avatar-two-line, .v-skeleton-loader__list-item-avatar {
        background: transparent;
    }
}

.v-navigation-drawer {
    z-index: 8;
}

.v-list .v-list-item--active, .v-list .v-list-item--active .v-icon {
    color: var(--v-primary-base);
}

</style>
