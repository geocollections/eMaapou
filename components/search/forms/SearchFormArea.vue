<template>
  <div>
    <v-form @submit.prevent="handleUpdate">
      <input-search v-model="query" />
      <search-actions class="mb-3" @click="handleReset" />
      <v-expansion-panels variant="accordion" multiple>
        <filter-input-text
          v-model="filters.name.value"
          :title="$t('filters.name').toString()"
          @update:model-value="handleUpdate"
        />
        <filter-input-autocomplete
          v-model="filters.county.value"
          ref="filterCounty"
          :title="$t('filters.county')"
          :query-function="suggestCounty"
          :hydration-function="hydrateCounty"
          @update:model-value="handleUpdate"
        />
        <filter-input-autocomplete
          v-model="filters.type.value"
          ref="filterType"
          :title="$t('filters.type')"
          :query-function="suggestType"
          :hydration-function="hydrateType"
          @update:model-value="handleUpdate"
        />
      </v-expansion-panels>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import type FilterInputAutocomplete from "~/components/filter/input/FilterInputAutocomplete.vue";

const emit = defineEmits(["update", "reset"]);

const areasStore = useAreas();
const { filters, query, solrQuery, solrFilters } = storeToRefs(areasStore);
const filterCounty = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterType = ref<InstanceType<typeof FilterInputAutocomplete>>();

function handleReset() {
  emit("reset");
}
function handleUpdate() {
  nextTick(() => {
    filterCounty.value?.refreshSuggestions();
    filterType.value?.refreshSuggestions();
    emit("update");
  });
}

const { suggest: suggestCounty, hydrate: hydrateCounty } = useAutocomplete(
  "/area",
  {
    idField: "maakond_id_s",
    nameField: { et: "maakond", en: "maakond_en" },
    filterExclude: "county",
    solrParams: { query: solrQuery, filter: solrFilters },
  },
);

const { suggest: suggestType, hydrate: hydrateType } = useAutocomplete(
  "/area",
  {
    idField: "area_type_id_s",
    nameField: { et: "area_type", en: "area_type_en" },
    filterExclude: "type",
    solrParams: { query: solrQuery, filter: solrFilters },
  },
);
</script>
