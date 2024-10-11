<script setup lang="ts" generic="T extends { id: number }">
import type { RouteLocationRaw } from "vue-router";
import {
  mdiArrowLeft,
  mdiCheck,
  mdiChevronLeft,
  mdiChevronRight,
} from "@mdi/js";

const props = withDefaults(
  defineProps<{
    results: T[];
    page: number;
    perPage?: number;
    totalResults: number;
    searchRoute: RouteLocationRaw;
    getResultRoute: (item: T) => RouteLocationRaw;
    showCheck?: boolean;
  }>(),
  { perPage: 10, showCheck: true },
);

const emit = defineEmits<{
  "page:previous": [page: number];
  "page:next": [page: number];
  "select": [value: { index: number; id: number }];
}>();

const itemRefs = ref<Record<number, any>>({});

const route = useRoute();
const hasNext = computed(() => props.page * props.perPage < props.totalResults);

onMounted(() => {
  nextTick(() => {
    scrollToCurrent();
  });
});

watch(() => props.results, () => {
  nextTick(() => {
    scrollToCurrent();
  });
});

function scrollToCurrent() {
  if (!Object.keys(itemRefs.value).includes(route.params.id as string))
    return;
  itemRefs.value[Number.parseInt(route.params.id as string)].$el.scrollIntoView({ block: "center" });
}
</script>

<template>
  <ul nav>
    <li
      :to="searchRoute"
      slim
      base-color="accent"
      :ripple="false"
      density="compact"
    >
      <template #title>
        <span class="text-body-2 text-black font-weight-medium">
          <slot name="parentTitle">
            <span>
              {{ $t("common.similar") }}
            </span>
          </slot>
        </span>
      </template>
      <template #prepend>
        <div :icon="mdiArrowLeft" />
      </template>
    </li>
  </ul>
  <div class="d-flex align-center justify-space-around">
    <button
      variant="text"
      size="small"
      :icon="mdiChevronLeft"
      :disabled="page <= 1"
      @click="emit('page:previous', page + 1)"
    />
    {{ page }}
    <button
      variant="text"
      size="small"
      :icon="mdiChevronRight"
      :disabled="!hasNext"
      @click="emit('page:next', page + 1)"
    />
  </div>
  <ul class="py-0">
    <template v-for="(item, index) in results" :key="`${index}-${item.id}`">
      <li
        :ref="(el :any) => (itemRefs[item.id] = el)"
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
        <template v-if="showCheck" #append="{ isActive }">
          <div v-if="isActive" color="accent">
            {{ mdiCheck }}
          </div>
        </template>
      </li>
      <div
        v-if="index !== perPage - 1"
        id="divider"
        class="mx-2"
      />
    </template>
  </ul>
  <div class="d-flex align-center justify-space-around pt-1 pb-10">
    <button
      variant="text"
      size="small"
      :icon="mdiChevronLeft"
      :disabled="page <= 1"
      @click="emit('page:previous', page + 1)"
    />
    {{ page }}
    <button
      variant="text"
      size="small"
      :icon="mdiChevronRight"
      :disabled="!hasNext"
      @click="emit('page:next', page + 1)"
    />
  </div>
</template>
