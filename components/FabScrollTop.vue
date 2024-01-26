<template>
  <v-fab-transition>
    <v-btn
      v-show="showFab"
      v-scroll="onScroll"
      position="fixed"
      class="mb-2 mr-2"
      location="bottom right"
      icon
      color="accent"
      @click="toTop"
    >
      <v-icon>{{ icons.mdiChevronUp }}</v-icon>
    </v-btn>
  </v-fab-transition>
</template>

<script>
import { mdiChevronUp } from "@mdi/js";
export default {
  name: "FabScrollTop",
  data: () => ({
    showFab: false,
  }),
  computed: {
    icons() {
      return { mdiChevronUp };
    },
  },
  methods: {
    onScroll(event) {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || event.target.scrollTop || 0;

      this.showFab = top > 400;
    },

    toTop() {
      this.$vuetify.goTo(0);
    },
  },
};
</script>
