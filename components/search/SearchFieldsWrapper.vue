<template>
  <base-card-expand
    :active="active"
    :show-body="showSearchViewForm"
    @click="showSearchViewForm = $event"
  >
    <template #title="{ showBody }">
      <div @click="$emit('click', !showBody)">
        <span>{{ $t('common.showSearchFields') }}</span>
        <v-icon class="pb-1">mdi-magnify</v-icon>
      </div>
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
