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
    color="blue-darken-1"
    variant="flat"
    class="px-3 text-capitalize"
  >
    <VIcon start>
      {{ icons.mdiMagnify }}
    </VIcon>
    <div class="montserrat">
      {{ $t('common.searchCommand') }}
    </div>
  </VBtn>
</template>
