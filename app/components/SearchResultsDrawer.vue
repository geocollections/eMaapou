<script setup lang="ts" generic="T extends { id: number }">
import {
  mdiArrowLeft,
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
  "page:previous": [page: number];
  "page:next": [page: number];
  "select": [value: { index: number; id: number }];
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
        <span class="text-body-2 text-black font-weight-medium">
          {{ $t("common.similar") }}
        </span>
      </template>
      <template #prepend>
        <VIcon :icon="mdiArrowLeft" />
      </template>
    </VListItem>
  </VList>
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
  <VList class="py-0">
    <template v-for="(item, index) in results" :key="`${index}-${item.id}`">
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
