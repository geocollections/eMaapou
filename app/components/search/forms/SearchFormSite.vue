<script setup lang="ts">
import type { ComponentExposed } from "vue-component-type-helpers";
import { FilterInputAutocomplete } from "#components";

const emit = defineEmits<{
  update: [];
  reset: [];
  submit: [];
}>();
const sitesStore = useSites();
const { filters, query, solrQuery, solrFilters } = storeToRefs(sitesStore);

const { suggest: suggestArea, hydrate: hydrateArea } = useAutocomplete(
  "/site",
  {
    idField: "area_id_s",
    nameField: { et: "area_name", en: "area_name_en" },
    filterExclude: "area",
    solrParams: { query: solrQuery, filter: solrFilters },
  },
);
const { suggest: suggestProject, hydrate: hydrateProject } = useAutocomplete(
  "/site",
  {
    idField: "project_id_s",
    nameField: { et: "project_name", en: "project_name_en" },
    filterExclude: "project",
    solrParams: { query: solrQuery, filter: solrFilters },
  },
);

const filterArea = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterProject = ref<ComponentExposed<typeof FilterInputAutocomplete>>();

const suggestionRefreshMap = computed(() => ({
  area: filterArea.value?.refreshSuggestions,
  project: filterProject.value?.refreshSuggestions,
}));

function handleReset() {
  emit("reset");
}

function handleUpdate(excludeKey?: keyof typeof suggestionRefreshMap.value) {
  nextTick(() => {
    refreshSuggestionFilters(suggestionRefreshMap.value, excludeKey);
    emit("update");
  });
}
function handleSubmit() {
  nextTick(() => {
    refreshSuggestionFilters(suggestionRefreshMap.value);
    emit("submit");
  });
}
</script>

<template>
  <div>
    <form class="pb-10" @submit.prevent="handleSubmit">
      <SearchFormInput v-model="query" />
      <SearchActions class="mb-3" @click="handleReset" />
      <div id="divider" class="mx-2" />
      <div
        variant="accordion"
        class="px-2"
        multiple
      >
        <FilterInputText
          v-model="filters.name.value"
          :title="$t('filters.name')"
          value="name"
          @update:model-value="handleUpdate()"
        />
        <FilterInputAutocomplete
          ref="filterArea"
          v-model="filters.area.value"
          :title="$t('filters.area')"
          :query-function="suggestArea"
          :hydration-function="hydrateArea"
          value="area"
          @update:model-value="handleUpdate('area')"
        />
        <FilterInputAutocomplete
          ref="filterProject"
          v-model="filters.project.value"
          :title="$t('filters.project')"
          :query-function="suggestProject"
          :hydration-function="hydrateProject"
          value="project"
          @update:model-value="handleUpdate('project')"
        />
        <FilterMap
          v-model="filters.geometry.value"
          value="map"
          @update:model-value="handleUpdate()"
        />
      </div>
      <div id="divider" class="mx-2" />
    </form>
  </div>
</template>
