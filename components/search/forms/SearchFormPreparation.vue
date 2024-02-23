<script setup lang="ts">
import { FilterInputAutocomplete } from "#components";

const emit = defineEmits(["update", "reset"]);
function handleReset() {
  emit("reset");
}

const filterLocality = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterStratigraphy = ref<InstanceType<typeof FilterInputAutocomplete>>();
function handleUpdate() {
  nextTick(() => {
    filterLocality.value?.refreshSuggestions();
    filterStratigraphy.value?.refreshSuggestions();
    emit("update");
  });
}

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
</script>

<template>
  <div>
    <v-form @submit.prevent="handleUpdate">
      <input-search v-model="query" />
      <search-actions class="mb-3" @click="handleReset" />
      <v-expansion-panels variant="accordion" multiple>
        <filter-input-text
          v-model="filters.number.value"
          :title="$t('filters.sampleNumber')"
          value="number"
          @update:model-value="handleUpdate"
        />
        <FilterInputAutocomplete
          ref="filterLocality"
          v-model="filters.locality.value"
          :title="$t('filters.locality')"
          :query-function="suggestLocality"
          :hydration-function="hydrateLocality"
          value="locality"
          @update:model-value="handleUpdate"
        />
        <filter-map
          v-model="filters.geometry.value"
          value="map"
          @update:model-value="handleUpdate"
        />
        <filter-input-range
          v-model="filters.depth.value"
          :title="$t('filters.depth')"
          value="depth"
          @update:model-value="handleUpdate"
        />
        <FilterInputAutocomplete
          ref="filterStratigraphy"
          v-model="filters.stratigraphy.value"
          :title="$t('filters.stratigraphyHierarchy')"
          :query-function="suggestStratigraphy"
          :hydration-function="hydrateStratigraphy"
          value="stratigraphy"
          @update:model-value="handleUpdate"
        />
      </v-expansion-panels>
    </v-form>
  </div>
</template>
