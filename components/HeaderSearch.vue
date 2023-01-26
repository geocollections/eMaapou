<template>
  <div class="d-sm-flex align-center my-4">
    <base-header :title="title" :icon="icon" />
    <v-divider v-if="$vuetify.breakpoint.smAndUp" vertical />
    <div class="ml-sm-3 text-h6">
      {{ $tc('common.count', count) }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import BaseHeader from '~/components/base/BaseHeader.vue'
export default defineComponent({
  name: 'HeaderSearch',
  components: { BaseHeader },
  props: {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
  },
})
</script>
