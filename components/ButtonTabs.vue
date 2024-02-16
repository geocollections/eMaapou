<template>
  <v-chip-group column active-class="active-tab  elevation-1">
    <transition-group name="flip-list">
      <v-chip
        v-for="(item, index) in tabs"
        :key="`button-tab-${index}`"
        class="mx-1 mb-1 pl-1"
        :disabled="item.count === 0"
        nuxt
        rounded
        exact
        :to="
          localePath({
            name: item.routeName,
            query: $route.query,
          })
        "
      >
        <v-chip
          small
          :ripple="false"
          class="accent darken-2 font-weight-regular mr-1 ma-0"
        >
          {{ item.count }}
        </v-chip>
        {{ $t(item.title, { number: item.count }) }}
      </v-chip>
    </transition-group>
  </v-chip-group>
</template>

<script setup lang="ts">
const props = defineProps<{
  tabs: any[];
}>();
const localePath = useLocalePath();
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
  background-color: var(--v-accent-darken1) !important;
  color: #ffffff !important;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: var(--v-accent-darken2) !important;

  &:before {
    background-color: white !important;
  }
}
</style>
