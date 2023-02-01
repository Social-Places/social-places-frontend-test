<template>
    <v-tooltip v-if="tooltip && !disabled" :bottom="bottom" :left="left" :right="right" :top="top">
        <template #activator="{on}">
            <slot name="outer-default" v-bind="{on: on}">
                <span v-on="on" :style="innerStyle">
                    <slot/>
                </span>
            </slot>
        </template>
        <span v-html="tooltip"/>
    </v-tooltip>
    <span v-else>
        <slot name="outer-default" v-bind="{on: null}">
            <slot/>
        </slot>
    </span>
</template>

<script>
export default {
    name: "TooltipHolder",
    props: {
        disabled: {
            type: Boolean,
            default: false,
        },
        tooltip: {
            type: String,
        },
        left: {
            type: Boolean,
            default: false,
        },
        right: {
            type: Boolean,
            default: false,
        },
        top: {
            type: Boolean,
            default: false,
        },
        bottom: {
            type: Boolean,
            default: false,
        },
        innerStyle: {
            type: [String, Object]
        }
    },
}
</script>

<style scoped>

</style>
