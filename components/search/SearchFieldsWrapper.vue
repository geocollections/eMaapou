<template>
  <base-card-expand
    :active="active"
    :show-body="showSearchViewForm"
    @click="showSearchViewForm = $event"
  >
    <template #title>
      <v-icon left>{{ icons.mdiFilterVariant }}</v-icon>
      <span>{{ $t('common.showSearchFields') }}</span>
    </template>
    <slot></slot>
  </base-card-expand>
</template>

<script>
import { mdiFilterVariant } from '@mdi/js'
import { mapFields } from 'vuex-map-fields'
import BaseCardExpand from '~/components/base/BaseCardExpand.vue'
export default {
  name: 'SearchFieldWrapper',
  components: { BaseCardExpand },
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
