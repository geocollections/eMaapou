<script setup lang="ts">
import type { ComponentExposed } from "vue-component-type-helpers";
import { FilterInputAutocomplete, FilterInputHierarchy } from "#components";

const emit = defineEmits<{
  update: [];
  reset: [];
  submit: [];
}>();

const { locale } = useI18n();
const taxaStore = useTaxa();
const { filters, query, solrQuery, solrFilters } = storeToRefs(taxaStore);

const { suggest: suggestTaxon, hydrate: hydrateTaxon, getChildren: getTaxonChildren } = useTaxonHierarchyFilter("/taxon", {
  filterExclude: "taxon",
  solrParams: { query: solrQuery, filter: solrFilters },
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
  <form class="portal-filter-form" @submit.prevent="handleSubmit">
    <UFormField
      :label="locale === 'et' ? 'Otsi taksoneid' : 'Search taxa'"
      :description="locale === 'et' ? 'Otsimiseks vajuta Enter.' : 'Press Enter to search.'"
      class="mb-2 px-1"
      :ui="{ label: 'text-[13px] text-portal-text', description: 'text-xs text-portal-muted' }"
    >
      <UInput
        v-model="query"
        type="search"
        :placeholder="locale === 'et' ? 'Taksoni või liigi nimi' : 'Taxon or species name'"
        color="neutral"
        class="w-full"
        :ui="{ base: 'min-h-11 rounded-portal-control ring-portal-border' }"
      />
    </UFormField>
    <p class="portal-filter-hint">
      {{ locale === 'et' ? 'Filtrivalikud rakenduvad kohe.' : 'Filter selections apply immediately.' }}
    </p>
    <USeparator />
    <div class="portal-filter-list">
      <FilterInputText
        v-model="filters.species.value"
        :title="$t('filters.taxonName')"
        value="species"
        @update:model-value="handleUpdate()"
      />
      <FilterInputText
        v-model="filters.author.value"
        :title="$t('filters.author')"
        value="author"
        @update:model-value="handleUpdate()"
      />
      <FilterInputHierarchy
        ref="filterTaxon"
        v-model="filters.taxon.value"
        :default-open="true"
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
        @update:model-value="handleUpdate('fossilGroup')"
      />
    </div>
    <div class="portal-filter-actions">
      <UButton
        type="button"
        color="neutral"
        variant="outline"
        class="portal-filter-clear"
        @click="handleReset"
      >
        {{ $t('common.resetSearch') }}
      </UButton>
      <UButton type="submit" class="portal-filter-submit">
        {{ $t('common.searchCommand') }}
      </UButton>
    </div>
  </form>
</template>
