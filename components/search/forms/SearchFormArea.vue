<script setup lang="ts">
import FilterInputAutocomplete from "~/components/filter/input/FilterInputAutocomplete.vue";

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

<template>
  <div>
    <VForm @submit.prevent="handleUpdate">
      <SearchFormInput v-model="query" />
      <SearchActions class="mb-3" @click="handleReset" />
      <VExpansionPanels
        variant="accordion"
        class="px-2"
        multiple
      >
        <FilterInputText
          v-model="filters.name.value"
          :title="$t('filters.name')"
          value="name"
          @update:model-value="handleUpdate"
        />
        <FilterInputAutocomplete
          ref="filterCounty"
          v-model="filters.county.value"
          :title="$t('filters.county')"
          :query-function="suggestCounty"
          :hydration-function="hydrateCounty"
          value="county"
          @update:model-value="handleUpdate"
        />
        <FilterInputAutocomplete
          ref="filterType"
          v-model="filters.type.value"
          :title="$t('filters.type')"
          :query-function="suggestType"
          :hydration-function="hydrateType"
          value="type"
          @update:model-value="handleUpdate"
        />
      </VExpansionPanels>
    </VForm>
  </div>
</template>
