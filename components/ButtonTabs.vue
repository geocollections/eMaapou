<template>
  <v-chip-group column active-class="active-tab font-weight-bold elevation-3">
    <transition-group name="flip-list">
      <v-chip
        v-for="(item, index) in tabs"
        :key="`button-tab-${index}`"
        class="mx-1 mb-1 montserrat elevation-1"
        :disabled="item.count === 0"
        nuxt
        rounded
        exact
        :to="
          localePath({
            name: item.routeName,
            params: { id: $route.params.id },
            query: { ...$route.query },
          })
        "
      >
        {{ $t(item.title, { number: item.count }) }}
      </v-chip>
    </transition-group>
  </v-chip-group>
</template>

<script>
export default {
  name: 'ButtonTabs',
  props: {
    tabs: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style lang="scss" scoped>
.tabs {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.flip-list-move {
  transition: all 0.4s ease;
  -webkit-transition: all 0.4s ease;
}

.v-chip-group ::v-deep .v-slide-group__wrapper {
  touch-action: auto;
}
.active-tab {
  background-color: white !important;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: var(--v-accent-lighten2) !important;

  &:before {
    background-color: white !important;
  }
}
</style>
