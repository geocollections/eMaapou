<template>
  <card-expandable
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
  </card-expandable>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import CardExpandable from '~/components/CardExpandable.vue'
export default {
  name: 'SearchFieldWrapper',
  components: { CardExpandable },
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
