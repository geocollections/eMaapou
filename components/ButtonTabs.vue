<script setup lang="ts">
const props = defineProps<{
  tabs: any[];
}>();
const localePath = useLocalePath();
const route = useRoute();

const getRouteBaseName = useRouteBaseName();

const selectedIndex = computed(() => {
  return props.tabs.findIndex(tab => tab.routeName === getRouteBaseName(route));
});
</script>

<template>
  <VChipGroup
    column
  >
    <TransitionGroup name="flip-list">
      <VChip
        v-for="(item, index) in tabs"
        :key="`button-tab-${index}`"
        class="mx-1 mb-1 pl-1"
        :class="{ 'active-tab': selectedIndex === index }"
        :disabled="item.count === 0"
        exact
        :to="
          localePath({
            name: item.routeName,
            query: route.query,
          })
        "
      >
        <VChip
          size="small"
          :ripple="false"
          class="bg-accent-darken-2 font-weight-regular mr-1 ma-0"
        >
          {{ item.count }}
        </VChip>
        {{ $t(item.title, { number: item.count }) }}
      </VChip>
    </TransitionGroup>
  </VChipGroup>
</template>

<style lang="scss" scoped>
.tabs {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.flip-list-move {
  transition: all 0.4s ease;
  -webkit-transition: all 0.4s ease;
}

.v-chip-group :deep(.v-slide-group__wrapper) {
  touch-action: auto;
}
.active-tab {
  background-color: rgb(var(--v-theme-accent-darken-1)) !important;
  color: #ffffff !important;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: rgb(var(--v-theme-accent-darken-2)) !important;

  &:before {
    background-color: white !important;
  }
}
</style>
