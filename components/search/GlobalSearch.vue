<template>
  <v-text-field
    v-model="search"
    outlined
    height=""
    class=""
    background-color="white"
    color="primary darken-2"
    :label="$t('common.searchAlt')"
    hide-details
    clearable
    autofocus
    @input="$emit('input')"
  >
    <template v-if="showButton" #append>
      <v-btn type="submit" large color="primary darken-2" dark elevation="0">
        <v-icon class="pr-2">mdi-magnify</v-icon>
        {{ $t('common.searchCommand') }}
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
  },
  computed: {
    ...mapFields('landing', ['search']),
  },
}
</script>

<style scoped lang="scss">
.v-text-field--outlined {
  ::v-deep fieldset {
    border-color: var(--v-primary-base);
    border-width: 2px;
  }
  ::v-deep .v-input__slot {
    padding-right: 0 !important;

    .v-input__append-inner {
      margin-top: 0;
      height: 56px;

      .v-input__icon {
        align-self: center;
        padding-right: 12px;
      }

      button {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        height: 56px;
      }
    }
  }
}
</style>
