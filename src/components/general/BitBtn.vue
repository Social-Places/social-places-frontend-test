<template>
    <v-tooltip :bottom="bottom || internalBottom" :left="left" :right="right" :top="top" :disabled="disableTooltip || tooltip === ''">
        <template #activator="{on}">
            <v-btn
                v-on="{...on, ...$listeners}"
                :color="color"
                :disabled="disabled"
                :elevation="elevation"
                :fab="fab"
                :fixed="!!fixed"
                :absolute="!!absolute"
                :href="href"
                :icon="!!icon && !fab"
                :large="large"
                :loading="loading"
                :outlined="outlined"
                :small="small"
                :style="{...internalFixed, ...internalAbsolute, ...buttonStyles}"
                :target="target"
                :tile="tile"
                :x-large="xLarge"
                :x-small="xSmall"
                :to="to"
                :class="buttonClass">
                <v-icon
                    :color="internalIconColor"
                    :large="large"
                    :small="small"
                    :x-large="xLarge"
                    :x-small="xSmall"
                    :class="iconClass">
                    {{ icon }}
                </v-icon>
            </v-btn>
        </template>
        <slot name="tooltip">
            <span v-html="tooltip"/>
        </slot>
    </v-tooltip>
</template>

<script>
export default {
    name: 'BitBtn',
    props: {
        tooltip: {
            type: String,
        },
        icon: {
            type: String,
        },
        color: {
            type: String,
            default: 'accent',
        },
        iconColor: {
            type: String,
            default: 'inherit',
        },
        xSmall: {
            type: Boolean,
            default: false,
        },
        small: {
            type: Boolean,
            default: false,
        },
        large: {
            type: Boolean,
            default: false,
        },
        xLarge: {
            type: Boolean,
            default: false,
        },
        bottom: {
            type: Boolean,
            default: false,
        },
        top: {
            type: Boolean,
            default: false,
        },
        left: {
            type: Boolean,
            default: false,
        },
        right: {
            type: Boolean,
            default: false,
        },
        loading: {
            type: Boolean,
            default: false,
        },
        href: {
            type: String,
            default: null,
        },
        target: {
            type: String,
            default: null,
        },
        fab: {
            type: Boolean,
            default: false,
        },
        iconClass: {
            type: String,
            default: null,
        },
        fixed: {
            type: Object,
            validator: (obj) => {
                return obj.hasEitherProperties(['right', 'left', 'top', 'bottom']);
            },
        },
        absolute: {
            type: Object,
            validator: (obj) => {
                return obj.hasEitherProperties(['right', 'left', 'top', 'bottom']);
            },
        },
        elevation: {
            type: [String, Number],
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        outlined: {
            type: Boolean,
            default: false,
        },
        tile: {
            type: Boolean,
            default: false,
        },
        to: {
            type: [String, Object, Promise],
            default: null,
        },
        disableTooltip: {
            type: Boolean,
            default: false
        },
        buttonClass: {
            type: String,
            default: null,
        },
        buttonStyles: {
            type: Object,
            default: ()=>({}),
        }
    },
    methods: {
        calcInternalFixedSide(side) {
            if (!this.fixed || !this.fixed[side]) {
                return null;
            }

            if (typeof this.fixed[side] === 'string' && this.fixed[side].indexOf('px') > 0) {
                return this.fixed[side];
            } else {
                return this.fixed[side] + 'px';
            }
        },
        calcInternalAbsoluteSide(side) {
            if (!this.absolute || !this.absolute[side]) {
                return null;
            }

            if (typeof this.absolute[side] === 'string' && this.absolute[side].indexOf('px') > 0) {
                return this.absolute[side];
            } else {
                return this.absolute[side] + 'px';
            }
        },
    },
    computed: {
        internalIconColor() {
            if (this.iconColor === 'inherit') {
                if (this.color) {
                    return this.color;
                }
                return null;
            }
            return this.iconColor;
        },
        internalBottom() {
            // defaults the prop to bottom if top, bottom, left and right have not been assigned
            return !this.top && !this.bottom && !this.left && !this.right;
        },
        internalFixed() {
            let sides = ['left', 'right', 'top', 'bottom'];
            let obj = {};
            for (let side of sides) {
                let val = this.calcInternalFixedSide(side);
                if (val !== null) {
                    obj[side] = val;
                }
            }
            return obj;
        },
        internalAbsolute() {
            let sides = ['left', 'right', 'top', 'bottom'];
            let obj = {};
            for (let side of sides) {
                let val = this.calcInternalAbsoluteSide(side);
                if (val !== null) {
                    obj[side] = val;
                }
            }
            return obj;
        },
    },
};
</script>

