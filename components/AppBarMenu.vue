<template>
  <span>
    <v-btn
      :id="id"
      text
      class="montserrat"
      style="text-transform: capitalize; font-size: 0.875rem"
    >
      {{ label }}
      <v-icon class="ml-1">{{ icons.mdiChevronDown }}</v-icon>
      <v-menu
        :activator="`#${id}`"
        content-class="elevation-2 mt-1"
        transition="slide-y-transition"
        offset-y
        bottom
        right
        attach=""
      >
        <slot />
      </v-menu>
    </v-btn>
  </span>
</template>

<script>
import { mdiChevronDown } from '@mdi/js'
export default {
  name: 'AppBarMenu',
  props: {
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
  computed: {
    icons() {
      return {
        mdiChevronDown,
      }
    },
  },
}
</script>
