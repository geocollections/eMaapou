<script setup lang="ts">
import type { ComponentExposed } from "vue-component-type-helpers";
import { FilterInputAutocomplete, FilterInputHierarchy } from "#components";

const emit = defineEmits<{
  update: [];
  reset: [];
  submit: [];
}>();

const stratigraphiesStore = useStratigraphies();
const { filters, query, solrQuery, solrFilters } = storeToRefs(stratigraphiesStore);

const { suggest: suggestType, hydrate: hydrateType } = useAutocomplete(
  "/stratigraphy",
  {
    idField: "type_s",
    nameField: { et: "stratigraphy_type", en: "stratigraphy_type_en" },
    filterExclude: "type",
    solrParams: { query: solrQuery, filter: solrFilters },
  },
);
const { suggest: suggestScope, hydrate: hydrateScope } = useAutocomplete(
  "/stratigraphy",
  {
    idField: "scope_s",
    nameField: { et: "stratigraphy_scope", en: "stratigraphy_scope_en" },
    filterExclude: "scope",
    solrParams: { query: solrQuery, filter: solrFilters },
  },
);
const { suggest: suggestRank, hydrate: hydrateRank } = useAutocomplete(
  "/stratigraphy",
  {
    idField: "rank_s",
    nameField: { et: "stratigraphy_rank", en: "stratigraphy_rank_en" },
    filterExclude: "rank",
    solrParams: { query: solrQuery, filter: solrFilters },
  },
);

const { suggest: suggestStratigraphy, hydrate: hydrateStratigraphy, getChildren: getStratigraphyChildren } = useStratigraphyHierarchyFilter("/stratigraphy", {
  filterExclude: "stratigraphy",
  solrParams: { query: solrQuery, filter: solrFilters },
  filter: filters.value.stratigraphy,
});

const filterType = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterScope = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterRank = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterStratigraphy = ref<ComponentExposed<typeof FilterInputHierarchy>>();

const suggestionRefreshMap = computed(() => ({
  type: filterType.value?.refreshSuggestions,
  scope: filterScope.value?.refreshSuggestions,
  rank: filterRank.value?.refreshSuggestions,
  stratigraphy: filterStratigraphy.value?.refreshSuggestions,
}));

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

function handleReset() {
  emit("reset");
}
</script>

<template>
  <VForm @submit.prevent="handleSubmit">
    <SearchFormInput v-model="query" />
    <SearchActions class="mb-3" @click="handleReset" />
    <VDivider class="mx-2" />
    <VExpansionPanels
      variant="accordion"
      class="px-2"
      multiple
    >
      <FilterInputHierarchy
        ref="filterStratigraphy"
        v-model="filters.stratigraphy.value"
        root-value="1"
        :title="$t('filters.stratigraphyHierarchy')"
        :hydration-function="hydrateStratigraphy"
        :get-children="getStratigraphyChildren"
        :suggestion-function="suggestStratigraphy"
        value="stratigraphy"
        @update:model-value="handleUpdate('stratigraphy')"
      />
      <FilterInputText
        v-model="filters.index.value"
        :title="$t('filters.index')"
        value="index"
        @update:model-value="handleUpdate()"
      />
      <FilterInputRange
        v-model="filters.age.value"
        :title="$t('filters.age')"
        value="age"
        @update:model-value="handleUpdate()"
      />
      <FilterInputAutocomplete
        ref="filterType"
        v-model="filters.type.value"
        :title="$t('filters.type')"
        :query-function="suggestType"
        :hydration-function="hydrateType"
        value="type"
        @update:model-value="handleUpdate('type')"
      />
      <FilterInputAutocomplete
        ref="filterRank"
        v-model="filters.rank.value"
        :title="$t('filters.rank')"
        :query-function="suggestRank"
        :hydration-function="hydrateRank"
        value="rank"
        @update:model-value="handleUpdate('rank')"
      />
      <FilterInputAutocomplete
        ref="filterScope"
        v-model="filters.scope.value"
        :title="$t('filters.scope')"
        :query-function="suggestScope"
        :hydration-function="hydrateScope"
        value="scope"
        @update:model-value="handleUpdate('scope')"
      />
    </VExpansionPanels>
    <VDivider class="mx-2" />
  </VForm>
</template>
