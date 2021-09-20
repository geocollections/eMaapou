<template>
  <v-text-field
    :value="value"
    color="accent"
    :placeholder="$t('common.searchAlt')"
    single-line
    hide-details
    solo
    height="48px"
    clearable
    autofocus
    @input="$emit('input', $event)"
  >
  </v-text-field>
</template>

<script>
export default {
  name: 'QuerySearchField',
  props: {
    showButton: {
      type: Boolean,
      default: false,
    },
    iconButton: {
      type: Boolean,
      default: false,
    },
    dense: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: '',
    },
  },
  methods: {
    test(e) {
      console.log('test')
      this.$emit('input', e)
    },
  },
}
</script>

<style scoped lang="scss">
$border-color: var(--v-accent-darken2);
$border-color-hover: var(--v-accent-darken2);
$border-width: 0px;
$transition: border 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);

.global-search {
  ::v-deep .v-input__slot {
    padding-right: 0 !important;

    fieldset {
      border-color: $border-color !important;
      border-width: $border-width;

      transition: $transition;
    }

    .v-input__append-inner {
      margin-top: 0 !important;
      // height: 40px;
      height: 56px;
      .v-input__icon {
        align-self: center;
        padding-right: 12px;
      }

      button {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-left-width: 0px !important;
        height: 100%;
        border-width: $border-width;
        border-color: $border-color !important;
        border-style: solid;
        transition: $transition;
      }
    }

    &:hover {
      fieldset {
        border-color: $border-color-hover !important;
        transition: $transition;
      }

      .v-input__append-inner {
        button {
          border-color: $border-color-hover !important;
          transition: $transition;
        }
      }
    }
  }
}
</style>
