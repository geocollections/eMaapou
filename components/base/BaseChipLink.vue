<script>
export default {
  name: "BaseChipLink",
  props: {
    title: {
      type: String,
      default: "",
    },
    altText: {
      type: String,
      default: "",
    },
    cardClass: {
      type: String,
      default: "main",
    },
    to: {
      type: String,
      default: "",
    },
    height: {
      type: String,
      default: "90px",
    },
  },
};
</script>

<template>
  <VChip
    class="pa-4 align-center d-flex font-weight-bold"
    :class="`${cardClass}`"
    hover
    nuxt
    style="background-color: white"
    :height="height"
    width="100%"
    :to="to"
  >
    <div class="text-none">
      {{ title }}
    </div>
  </VChip>
</template>

<style lang="scss" scoped>
.v-chip {
  border-bottom-width: 3px !important;
  border-bottom-style: solid !important;

  border-color: var(--v-primary-base) !important;
}
</style>
