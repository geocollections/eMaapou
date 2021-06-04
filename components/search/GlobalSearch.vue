<template>
  <v-text-field
    v-model="search"
    single-line
    class="global-search"
    background-color="white"
    color="accent darken-3"
    :label="$t('common.searchAlt')"
    hide-details
    solo
    clearable
    autofocus
    @input="$emit('input')"
  >
    <template v-if="showButton" #append>
      <v-btn type="submit" color="accent darken-3" dark elevation="0">
        <v-icon>mdi-magnify</v-icon>
        <div v-if="!iconButton" class="pl-2">
          {{ $t('common.searchCommand') }}
        </div>
      </v-btn>
    </template>
  </v-text-field>
</template>

<script>
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'GlobalSearch',
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
  },
  computed: {
    ...mapFields('landing', ['search']),
  },
}
</script>

<style scoped lang="scss">
.global-search {
  ::v-deep fieldset {
    border-color: var(--v-accent-darken-3);
    border-width: 1px;
  }
  ::v-deep .v-input__slot {
    padding-right: 0 !important;

    .v-input__append-inner {
      margin-top: 0 !important;
      // height: 40px;
      height: 48px;
      .v-input__icon {
        align-self: center;
        padding-right: 12px;
      }

      button {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        height: 100%;
        // border-width: 2px;
        // border-color: var(--v-primary-base) !important;
      }
    }
  }
}
</style>
