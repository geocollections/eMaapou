<script setup lang="ts">
import type { ComponentExposed } from "vue-component-type-helpers";
import { FilterInputAutocomplete } from "#components";

const emit = defineEmits<{
  update: [];
  reset: [];
  submit: [];
}>();

const preparationsStore = usePreparations();
const { filters, query, solrQuery, solrFilters }
  = storeToRefs(preparationsStore);

const { suggest: suggestLocality, hydrate: hydrateLocality } = useAutocomplete(
  "/preparation",
  {
    idField: "locality_id_s",
    nameField: { et: "locality", en: "locality_en" },
    filterExclude: "locality",
    solrParams: { query: solrQuery, filter: solrFilters },
  },
);
const { suggest: suggestStratigraphy, hydrate: hydrateStratigraphy }
  = useAutocomplete("/preparation", {
    idField: "stratigraphy_hierarchy",
    nameField: { et: "stratigraphy", en: "stratigraphy_en" },
    filterExclude: "stratigraphy",
    solrParams: { query: solrQuery, filter: solrFilters },
  });

const filterLocality = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterStratigraphy = ref<ComponentExposed<typeof FilterInputAutocomplete>>();

const suggestionRefreshMap = computed(() => ({
  locality: filterLocality.value?.refreshSuggestions,
  stratigraphy: filterStratigraphy.value?.refreshSuggestions,
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
      <FilterInputCheckbox
        v-model="filters.hasImage.value"
        :label="$t('filters.hasImage')"
        @update:model-value="handleUpdate()"
      />
      <div id="divider" class="mx-2" />
      <VExpansionPanels
        class="px-2"
        variant="accordion"
        multiple
      >
        <FilterInputText
          v-model="filters.number.value"
          :title="$t('filters.sampleNumber')"
          value="number"
          @update:model-value="handleUpdate()"
        />
        <FilterInputAutocomplete
          ref="filterLocality"
          v-model="filters.locality.value"
          :title="$t('filters.locality')"
          :query-function="suggestLocality"
          :hydration-function="hydrateLocality"
          value="locality"
          @update:model-value="handleUpdate('locality')"
        />
        <FilterMap
          v-model="filters.geometry.value"
          value="map"
          @update:model-value="handleUpdate()"
        />
        <FilterInputRange
          v-model="filters.depth.value"
          :title="$t('filters.depth')"
          value="depth"
          @update:model-value="handleUpdate()"
        />
        <FilterInputAutocomplete
          ref="filterStratigraphy"
          v-model="filters.stratigraphy.value"
          :title="$t('filters.stratigraphyHierarchy')"
          :query-function="suggestStratigraphy"
          :hydration-function="hydrateStratigraphy"
          value="stratigraphy"
          @update:model-value="handleUpdate('stratigraphy')"
        />
      </VExpansionPanels>
      <div id="divider" class="mx-2" />
    </form>
  </div>
</template>
