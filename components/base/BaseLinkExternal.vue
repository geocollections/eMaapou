<template>
  <a :href="href" :target="target" class="text-link">
    <slot> </slot>
    <span style="white-space: nowrap; display: inline-block">
      <slot name="icon">
        <v-icon class="open-new-icon" x-small>{{ icons.mdiOpenInNew }}</v-icon>
      </slot>
    </span>
  </a>
</template>

<script>
import { mdiOpenInNew } from '@mdi/js'
export default {
  name: 'BaseLinkExternal',
  props: {
    href: {
      type: String,
      default: null,
    },
    target: { type: String, default: '_blank' },
  },
  computed: {
    icons() {
      return {
        mdiOpenInNew,
      }
    },
  },
}
</script>

<style scoped>
.open-new-icon {
  vertical-align: text-top !important;
}

.open-new-icon:hover {
  text-decoration: none !important;
}
</style>
