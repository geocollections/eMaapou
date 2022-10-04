<template>
  <base-card-expand
    :active="active"
    :show-body="showSearchViewForm"
    @click="showSearchViewForm = $event"
  >
    <template #title>
      <v-icon left>mdi-filter-variant</v-icon>
      <span>{{ $t('common.showSearchFields') }}</span>
    </template>
    <slot></slot>
  </base-card-expand>
</template>

<script>
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
  },
}
</script>
