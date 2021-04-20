<template>
  <v-chip-group column active-class="active primary--text text--darken-2">
    <transition-group name="flip-list">
      <v-chip
        v-for="(item, index) in tabs"
        :key="`button-tab-${index}`"
        class="mx-2 mb-3"
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

.active {
  font-weight: bold;
  border-width: 2px;
  border-style: solid;
  border-color: var(--v-primary-darken2);
}

.flip-list-move {
  transition: all 0.4s ease;
  -webkit-transition: all 0.4s ease;
}

.v-chip-group ::v-deep .v-slide-group__wrapper {
  touch-action: auto;
}
</style>
