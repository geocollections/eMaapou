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
  <VBtn
    type="submit"
    color="warning"
    dark
    class="px-3 text-body-1 text-capitalize"
  >
    <VIcon start>
      {{ icons.mdiMagnify }}
    </VIcon>
    <div class="montserrat">
      {{ $t('common.searchCommand') }}
    </div>
  </VBtn>
</template>
