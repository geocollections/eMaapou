<template>
  <v-icon :color="value ? 'green' : 'red'" small>
    {{ value ? icons.mdiCheckBold : icons.mdiCloseThick }}
  </v-icon>
</template>

<script>
import { mdiCheckBold, mdiCloseThick } from '@mdi/js'
export default {
  name: 'BaseBoolean',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    icons() {
      return {
        mdiCheckBold,
        mdiCloseThick,
      }
    },
  },
}
</script>
