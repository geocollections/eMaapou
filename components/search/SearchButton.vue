<script>
import { mdiMagnify } from "@mdi/js";

export default {
  name: "SearchButton",
  computed: {
    icons() {
      return {
        mdiMagnify,
      };
    },
  },
};
</script>

<template>
  <v-btn
    type="submit"
    color="warning"
    dark
    class="px-3 text-body-1 text-capitalize"
  >
    <v-icon start>
      {{ icons.mdiMagnify }}
    </v-icon>
    <div class="montserrat">
      {{ $t('common.searchCommand') }}
    </div>
  </v-btn>
</template>
