<script>
import { mdiCheckBold, mdiCloseThick } from "@mdi/js";

export default {
  name: "BaseBoolean",
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
      };
    },
  },
};
</script>

<template>
  <VIcon :color="value ? 'green' : 'red'" size="small">
    {{ value ? icons.mdiCheckBold : icons.mdiCloseThick }}
  </VIcon>
</template>
