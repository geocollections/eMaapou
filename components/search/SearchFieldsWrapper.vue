<template>
  <div>
    <div class="d-flex">
      <!-- <v-icon left>{{ icons.mdiFilterVariant }}</v-icon> -->
      <div class="text-h6">{{ $t('common.showSearchFields') }}</div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import { mdiFilterVariant } from '@mdi/js'
import { mapFields } from 'vuex-map-fields'
export default {
  name: 'SearchFieldWrapper',
  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapFields('settings', {
      showSearchViewForm: 'showSearchViewForm',
    }),
    icons() {
      return {
        mdiFilterVariant,
      }
    },
  },
}
</script>
