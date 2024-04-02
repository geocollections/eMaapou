<script setup lang="ts" generic="T">
import {
  mdiArrowUpLeft,
  mdiCheck,
  mdiChevronLeft,
  mdiChevronRight,
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
  "select": [{ index: number; id: number }];
}>();

const hasNext = computed(() => props.page * props.perPage < props.totalResults);
</script>

<template>
  <VList nav>
    <VListItem
      :to="searchRoute"
      slim
      base-color="accent"
      :ripple="false"
      density="compact"
    >
      <template #title>
        <span class="text-body-2">
          Back to search
        </span>
      </template>
      <template #prepend>
        <VIcon :icon="mdiArrowUpLeft" />
      </template>
    </VListItem>
  </VList>
  <!-- <VBtn -->
  <!--   variant="text" -->
  <!--   color="accent" -->
  <!--   class="text-none mx-2" -->
  <!--   :prepend-icon="mdiArrowUpLeft" -->
  <!--   :to="searchRoute" -->
  <!-- > -->
  <!--   Back to search -->
  <!-- </VBtn> -->
  <div class="d-flex align-center justify-space-around">
    <VBtn
      variant="text"
      size="small"
      :icon="mdiChevronLeft"
      :disabled="page <= 1"
      @click="emit('page:previous', page + 1)"
    />
    {{ page }}
    <VBtn
      variant="text"
      size="small"
      :icon="mdiChevronRight"
      :disabled="!hasNext"
      @click="emit('page:next', page + 1)"
    />
  </div>
  <VList>
    <template v-for="(item, index) in results" :key="index">
      <VListItem
        class="pa-2 my-1 mx-2 text-body-2"
        elevation="0"
        rounded
        :to="getResultRoute(item)"
        color="accent-darken-1"
        @click="emit('select', { index, id: item.id })"
      >
        <template #title>
          <slot
            name="itemTitle"
            :item="item"
            :index="index"
          />
        </template>
        <template #subtitle>
          <slot
            name="itemSubtitle"
            :item="item"
            :index="index"
          />
        </template>
        <template #append="{ isActive }">
          <VIcon v-if="isActive" color="accent">
            {{ mdiCheck }}
          </VIcon>
        </template>
      </VListItem>
      <VDivider v-if="index !== perPage - 1" class="mx-2" />
    </template>
  </VList>
</template>
