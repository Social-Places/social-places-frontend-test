import Vue from 'vue';

export default class ServerBus extends Vue
{
    $on(event, callback)
    {
        return super.$on(event, callback);
    }

    $once(event, callback)
    {
        if (this.logging) {
            console.log('$once', event, callback.name);
        }
        return super.$once(event, callback);
    }

    $off(event, callback)
    {
        if (this.logging) {
            console.log('$off', event, callback.name);
        }
        return super.$off(event, callback);
    }

    $emit(event, ...args)
    {
        if (this.logging) {
            console.log('$emit', event, ...args);
        }
        return super.$emit(event, ...args);
    }

    enableLogging()
    {
        this.logging = true;
    }

    disableLogging()
    {
        this.logging = false;
    }
}