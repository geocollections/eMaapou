<script setup lang="ts">
import type { ComponentExposed } from "vue-component-type-helpers";
import { FilterInputAutocomplete, FilterInputHierarchy } from "#components";

const emit = defineEmits<{
  update: [];
  reset: [];
  submit: [];
}>();

const samplesStore = useSamples();
const { filters, query, solrQuery, solrFilters } = storeToRefs(samplesStore);
const { suggest: suggestLocality, hydrate: hydrateLocality } = useAutocomplete(
  "/sample",
  {
    idField: "locality_id_s",
    nameField: { et: "locality", en: "locality_en" },
    filterExclude: "locality",
    solrParams: { query: solrQuery, filter: solrFilters },
  },
);
const { suggest: suggestCollector, hydrate: hydrateCollector }
  = useAutocomplete("/sample", {
    idField: "collector_id_s",
    nameField: "collector",
    filterExclude: "collector",
    solrParams: { query: solrQuery, filter: solrFilters },
  });
const { suggest: suggestInstitution, hydrate: hydrateInstitution }
  = useAutocomplete("/sample", {
    idField: "database_id_s",
    nameField: "acronym",
    filterExclude: "institution",
    solrParams: { query: solrQuery, filter: solrFilters },
  });

const { suggest: suggestStratigraphy, hydrate: hydrateStratigraphy, getChildren: getStratigraphyChildren } = useStratigraphyHierarchyFilter("/sample", {
  filterExclude: "stratigraphy",
  solrParams: { query: solrQuery, filter: solrFilters },
  filter: filters.value.stratigraphy,
});

const { suggest: suggestRock, hydrate: hydrateRock, getChildren: getRockChildren } = useRockHierarchyFilter("/sample", {
  filterExclude: "rock",
  solrParams: { query: solrQuery, filter: solrFilters },
  filter: filters.value.rock,
});

function handleReset() {
  emit("reset");
}

const filterLocality = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterStratigraphy = ref<ComponentExposed<typeof FilterInputHierarchy>>();
const filterRock = ref<ComponentExposed<typeof FilterInputHierarchy>>();
const filterCollector = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterInstitution = ref<ComponentExposed<typeof FilterInputAutocomplete>>();

const suggestionRefreshMap = computed(() => {
  return {
    locality: filterLocality.value?.refreshSuggestions,
    stratigraphy: filterStratigraphy.value?.refreshSuggestions,
    rock: filterRock.value?.refreshSuggestions,
    collector: filterCollector.value?.refreshSuggestions,
    institution: filterInstitution.value?.refreshSuggestions,
  };
});
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
    <VForm class="pb-10" @submit.prevent="handleSubmit">
      <SearchFormInput v-model="query" />
      <SearchActions class="mb-3" @click="handleReset" />
      <FilterInputCheckbox
        v-model="filters.hasImage.value"
        :label="$t('filters.hasImage')"
        @update:model-value="handleUpdate()"
      />
      <FilterInputCheckbox
        v-model="filters.hasCoordinates.value"
        :label="$t('filters.hasCoordinates')"
        @update:model-value="handleUpdate()"
      />
      <VDivider class="mx-2" />
      <VExpansionPanels
        variant="accordion"
        class="px-2"
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
          number-type="float"
          @update:model-value="handleUpdate()"
        />
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
        <FilterInputHierarchy
          ref="filterRock"
          v-model="filters.rock.value"
          root-value=""
          :title="$t('filters.rockHierarchy')"
          :hydration-function="hydrateRock"
          :get-children="getRockChildren"
          :suggestion-function="suggestRock"
          value="rock"
          @update:model-value="handleUpdate('rock')"
        />
        <FilterInputAutocomplete
          ref="filterCollector"
          v-model="filters.collector.value"
          :title="$t('filters.collector')"
          :query-function="suggestCollector"
          :hydration-function="hydrateCollector"
          value="collector"
          @update:model-value="handleUpdate('collector')"
        />
        <FilterInputAutocomplete
          ref="filterInstitution"
          v-model="filters.institution.value"
          :title="$t('filters.institution')"
          :query-function="suggestInstitution"
          :hydration-function="hydrateInstitution"
          :per-page="-1"
          value="institution"
          @update:model-value="handleUpdate('institution')"
        />
      </VExpansionPanels>
      <VDivider class="mx-2" />
    </VForm>
  </div>
</template>
