import {VAutocomplete} from 'vuetify/lib';
import httpClient from '@/classes/httpClient';

export default {
    name: 'url-autocomplete',
    extends: VAutocomplete,
    props: {
        url: {
            type: String
        },
        itemValue: {
            default: 'id'
        },
        itemText: {
            default: 'name'
        }
    },
    watch: {
        url() {
            this.fetchItems();
        }
    },
    mounted() {
        this.fetchItems();
    },
    methods: {
        fetchItems() {
            if (this.url) {
                this.$emit('update:loading', true);
                // this.loading = true;
                httpClient.get(this.url).then(({data}) => {
                    this.cachedItems = data;
                    // this.items = data;
                }).finally(() => {
                    this.$emit('update:loading', false);
                })
            }
        }
    }
}
