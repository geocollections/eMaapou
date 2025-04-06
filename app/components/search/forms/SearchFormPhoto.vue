<script setup lang="ts">
import type { ComponentExposed } from "vue-component-type-helpers";
import { FilterInputAutocomplete } from "#components";

const emit = defineEmits<{
  update: [];
  reset: [];
  submit: [];
}>();

const photosStore = usePhotos();
const { filters, query, solrQuery, solrFilters } = storeToRefs(photosStore);
const allSolrFilters = computed(() => {
  return [...solrFilters.value, "imageset_id:[* TO *]"];
});

const { suggest: suggestLocality, hydrate: hydrateLocality } = useAutocomplete(
  "/attachment",
  {
    idField: "locality_id_s",
    nameField: { et: "locality", en: "locality_en" },
    filterExclude: "locality",
    solrParams: { query: solrQuery, filter: allSolrFilters },
  },
);
const { suggest: suggestCountry, hydrate: hydrateCountry } = useAutocomplete(
  "/attachment",
  {
    idField: "country_id_s",
    nameField: { et: "country", en: "country_en" },
    filterExclude: "country",
    solrParams: { query: solrQuery, filter: allSolrFilters },
  },
);

const { suggest: suggestInstitution, hydrate: hydrateInstitution }
  = useAutocomplete("/attachment", {
    idField: "database_id_s",
    nameField: "acronym",
    filterExclude: "institution",
    solrParams: { query: solrQuery, filter: allSolrFilters },
  });
const { suggest: suggestAuthor, hydrate: hydrateAuthor }
  = useAutocomplete("/attachment", {
    idField: "author_id_s",
    nameField: "agent",
    filterExclude: "author",
    solrParams: { query: solrQuery, filter: allSolrFilters },
  });

const filterCountry = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterLocality = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterInstitution = ref<ComponentExposed<typeof FilterInputAutocomplete>>();
const filterAuthor = ref<ComponentExposed<typeof FilterInputAutocomplete>>();

const suggestionRefreshMap = computed(() => ({
  country: filterCountry.value?.refreshSuggestions,
  locality: filterLocality.value?.refreshSuggestions,
  institution: filterInstitution.value?.refreshSuggestions,
  author: filterAuthor.value?.refreshSuggestions,
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
          v-model="filters.title.value"
          :title="$t('filters.title')"
          value="title"
          @update:model-value="handleUpdate()"
        />
        <FilterInputAutocomplete
          ref="filterAuthor"
          v-model="filters.author.value"
          :title="$t('filters.author')"
          :query-function="suggestAuthor"
          :hydration-function="hydrateAuthor"
          value="author"
          @update:model-value="handleUpdate('author')"
        />
        <FilterInputText
          v-model="filters.authorText.value"
          :title="$t('filters.authorText')"
          value="authorText"
          @update:model-value="handleUpdate()"
        />
        <FilterInputDate
          v-model="filters.date.value"
          :title="$t('filters.date')"
          value="date"
          @update:model-value="handleUpdate()"
        />
        <FilterInputText
          v-model="filters.dateText.value"
          :title="$t('filters.dateText')"
          value="dateText"
          @update:model-value="handleUpdate()"
        />
        <FilterInputText
          v-model="filters.description.value"
          :title="$t('filters.description')"
          value="description"
          @update:model-value="handleUpdate()"
        />
        <FilterInputText
          v-model="filters.tags.value"
          :title="$t('filters.tags')"
          value="tags"
          @update:model-value="handleUpdate()"
        />
        <FilterInputText
          v-model="filters.people.value"
          :title="$t('filters.people')"
          value="people"
          @update:model-value="handleUpdate()"
        />
        <FilterMap
          v-model="filters.geometry.value"
          value="map"
          @update:model-value="handleUpdate()"
        />
        <FilterInputAutocomplete
          ref="filterCountry"
          v-model="filters.country.value"
          :title="$t('filters.country')"
          :query-function="suggestCountry"
          :hydration-function="hydrateCountry"
          value="country"
          @update:model-value="handleUpdate('country')"
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
        <FilterInputText
          v-model="filters.place.value"
          :title="$t('filters.place')"
          value="place"
          @update:model-value="handleUpdate()"
        />
        <FilterInputText
          v-model="filters.number.value"
          :title="$t('filters.number')"
          value="number"
          @update:model-value="handleUpdate()"
        />
        <FilterInputRange
          v-model="filters.size.value"
          :title="$t('filters.imageSize')"
          value="imageSize"
          @update:model-value="handleUpdate()"
        />
        <FilterInputAutocomplete
          ref="filterInstitution"
          v-model="filters.institution.value"
          :title="$t('filters.institution')"
          :query-function="suggestInstitution"
          :hydration-function="hydrateInstitution"
          value="institution"
          @update:model-value="handleUpdate('institution')"
        />
      </VExpansionPanels>
      <VDivider class="mx-2" />
    </VForm>
  </div>
</template>
