<script setup lang="ts">
import type { ComponentExposed } from "vue-component-type-helpers";
import { FilterInputAutocomplete } from "#components";

const emit = defineEmits(["update", "reset", "submit"]);

const areasStore = useAreas();
const { filters, query, solrQuery, solrFilters } = storeToRefs(areasStore);

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

const { suggest: suggestMiner, hydrate: hydrateMiner } = useAutocomplete(
  "/area",
  {
    idField: "kaevandaja",
    nameField: "kaevandaja",
    filterExclude: "miner",
    solrParams: { query: solrQuery, filter: solrFilters },
  },
);

const { suggest: suggestMiningPermit, hydrate: hydrateMiningPermit } = useAutocomplete(
  "/area",
  {
    idField: "loa_number",
    nameField: "loa_number",
    filterExclude: "miningPermit",
    solrParams: { query: solrQuery, filter: solrFilters },
  },
);

const { suggest: suggestMiningPermitOwner, hydrate: hydrateMiningPermitOwner } = useAutocomplete(
  "/area",
  {
    idField: "loa_omanik",
    nameField: "loa_omanik",
    filterExclude: "miningPermitOwner",
    solrParams: { query: solrQuery, filter: solrFilters },
  },
);

const filterCounty = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterType = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterMiner = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterMiningPermit = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterMiningPermitOwner = ref<ComponentExposed<typeof FilterInputAutocomplete>>();

const suggestionRefreshMap = computed(() => ({
  county: filterCounty.value?.refreshSuggestions,
  type: filterType.value?.refreshSuggestions,
  miner: filterMiner.value?.refreshSuggestions,
  miningPermit: filterMiningPermit.value?.refreshSuggestions,
  miningPermitOwner: filterMiningPermitOwner.value?.refreshSuggestions,
}));

function handleReset() {
  emit("reset");
}

function handleUpdate(excludeKey?: string) {
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
  <VForm class="pb-10" @submit.prevent="handleSubmit">
    <SearchFormInput v-model="query" />
    <SearchActions class="mb-3" @click="handleReset" />
    <VDivider class="mx-2" />
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
      <FilterInputRange
        v-model="filters.size.value"
        :title="$t('filters.size')"
        value="size"
        @update:model-value="handleUpdate"
      />
      <FilterInputAutocomplete
        ref="filterMiningPermit"
        v-model="filters.miningPermit.value"
        :title="$t('filters.miningPermit')"
        :query-function="suggestMiningPermit"
        :hydration-function="hydrateMiningPermit"
        value="miningPermit"
        @update:model-value="handleUpdate"
      />
      <FilterInputAutocomplete
        ref="filterMiningPermitOwner"
        v-model="filters.miningPermitOwner.value"
        :title="$t('filters.miningPermitOwner')"
        :query-function="suggestMiningPermitOwner"
        :hydration-function="hydrateMiningPermitOwner"
        value="miningPermitOwner"
        @update:model-value="handleUpdate"
      />
      <FilterInputAutocomplete
        ref="filterMiner"
        v-model="filters.miner.value"
        :title="$t('filters.miner')"
        :query-function="suggestMiner"
        :hydration-function="hydrateMiner"
        value="miner"
        @update:model-value="handleUpdate"
      />
    </VExpansionPanels>
    <VDivider class="mx-2" />
  </VForm>
</template>
