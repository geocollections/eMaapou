<template>
  <v-btn
    variant="plain"
    class="text-capitalize mx-2"
    :prepend-icon="mdiArrowUpLeft"
    :to="searchRoute"
  >
    Back to search
  </v-btn>
  <div class="d-flex align-center justify-space-around">
    <v-btn
      variant="plain"
      size="small"
      :icon="mdiChevronLeft"
      :disabled="page <= 1"
      @click="emit('page:previous', page + 1)"
    />
    {{ page }}
    <v-btn
      variant="plain"
      size="small"
      :icon="mdiChevronRight"
      :disabled="!hasNext"
      @click="emit('page:next', page + 1)"
    />
  </div>
  <v-list>
    <template v-for="(item, index) in results">
      <v-list-item
        class="pa-2 ma-1 text-body-2"
        elevation="0"
        rounded
        :to="getResultRoute(item)"
        active-class="active-item"
        @click="emit('select', { index, id: item.id })"
      >
        <template #title>
          <slot name="itemTitle" :item="item" :index="index" />
        </template>
        <template #subtitle>
          <slot name="itemSubtitle" :item="item" :index="index" />
        </template>
        <template #append="{ isActive }">
          <v-icon v-if="isActive" color="accent">
            {{ mdiCheck }}
          </v-icon>
        </template>
      </v-list-item>
      <v-divider class="mx-1" v-if="index !== perPage - 1" />
    </template>
  </v-list>
</template>

<script setup lang="ts" generic="T">
import {
  mdiCheck,
  mdiChevronLeft,
  mdiChevronRight,
  mdiArrowUpLeft,
} from "@mdi/js";
import type { RouteLocationRaw } from "vue-router";

const props = withDefaults(
  defineProps<{
    results: T[];
    page: number;
    perPage?: number;
    totalResults: number;
    searchRoute: RouteLocationRaw;
    getResultRoute: (item: T) => RouteLocationRaw;
  }>(),
  { perPage: 10 },
);

const emit = defineEmits<{
  "page:previous": [number];
  "page:next": [number];
  select: [{ index: number; id: number }];
}>();

const hasNext = computed(() => props.page * props.perPage < props.totalResults);
</script>

<style scoped>
.active-item {
  background-color: rgba(var(--v-theme-accent-lighten-3), 0.2);
}
</style>
