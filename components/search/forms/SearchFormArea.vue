<script setup lang="ts">
import FilterInputAutocomplete from "~/components/filter/input/FilterInputAutocomplete.vue";

const emit = defineEmits(["update", "reset"]);

const areasStore = useAreas();
const { filters, query, solrQuery, solrFilters } = storeToRefs(areasStore);
const filterCounty = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterType = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterMiner = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterMiningPermit = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterMiningPermitOwner = ref<InstanceType<typeof FilterInputAutocomplete>>();

function handleReset() {
  emit("reset");
}
function handleUpdate() {
  nextTick(() => {
    filterCounty.value?.refreshSuggestions();
    filterType.value?.refreshSuggestions();
    filterMiner.value?.refreshSuggestions();
    filterMiningPermit.value?.refreshSuggestions();
    filterMiningPermitOwner.value?.refreshSuggestions();
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
</script>

<template>
  <VForm class="pb-10" @submit.prevent="handleUpdate">
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
