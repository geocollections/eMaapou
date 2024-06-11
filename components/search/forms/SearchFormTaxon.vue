<script setup lang="ts">
import type { ComponentExposed } from "vue-component-type-helpers";
import { FilterInputAutocomplete, FilterInputHierarchy } from "#components";

const emit = defineEmits(["update", "reset", "submit"]);

const taxaStore = useTaxa();
const { filters, query, solrQuery, solrFilters } = storeToRefs(taxaStore);

const { suggest: suggestTaxon, hydrate: hydrateTaxon, getChildren: getTaxonChildren } = useTaxonHierarchyFilter("/taxon", {
  filterExclude: "taxon",
  solrParams: { query: solrQuery, filter: solrFilters },
  filter: filters.value.taxon,
});

const { suggest: suggestFossilGroup, hydrate: hydrateFossilGroup }
  = useAutocomplete("/taxon", {
    idField: "fossil_group_id_s",
    nameField: "fossil_group",
    filterExclude: "fossilGroup",
    solrParams: { query: solrQuery, filter: solrFilters },
  });

const filterTaxon = ref<ComponentExposed<typeof FilterInputHierarchy>>();
const filterFossilGroup = ref<ComponentExposed<typeof FilterInputAutocomplete>>();

const suggestionRefreshMap = computed(() => ({
  taxon: filterTaxon.value?.refreshSuggestions,
  fossilGroup: filterFossilGroup.value?.refreshSuggestions,
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
        v-model="filters.species.value"
        :title="$t('filters.taxon')"
        value="species"
        @update:model-value="handleUpdate"
      />
      <FilterInputText
        v-model="filters.author.value"
        :title="$t('filters.author')"
        value="author"
        @update:model-value="handleUpdate"
      />
      <FilterInputHierarchy
        ref="filterTaxon"
        v-model="filters.taxon.value"
        root-value=""
        :title="$t('filters.taxonHierarchy')"
        :hydration-function="hydrateTaxon"
        :get-children="getTaxonChildren"
        :suggestion-function="suggestTaxon"
        value="taxon"
        @update:model-value="handleUpdate('taxon')"
      />
      <FilterInputAutocomplete
        ref="filterFossilGroup"
        v-model="filters.fossilGroup.value"
        :title="$t('filters.fossilGroup')"
        :query-function="suggestFossilGroup"
        :hydration-function="hydrateFossilGroup"
        value="fossilGroup"
        @update:model-value="handleUpdate"
      />
    </VExpansionPanels>
    <VDivider class="mx-2" />
  </VForm>
</template>
