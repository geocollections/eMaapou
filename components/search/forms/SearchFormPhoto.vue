<script setup lang="ts">
import FilterInputAutocomplete from "~/components/filter/input/FilterInputAutocomplete.vue";

const emit = defineEmits(["update", "reset"]);

const photosStore = usePhotos();
const { filters, query, solrQuery, solrFilters } = storeToRefs(photosStore);

const filterCountry = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterLocality = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterInstitution = ref<InstanceType<typeof FilterInputAutocomplete>>();

const allSolrFilters = computed(() => {
  return [...solrFilters.value, "specimen_image_attachment:\"2\""];
});

function handleReset() {
  emit("reset");
}
function handleUpdate() {
  nextTick(() => {
    filterCountry.value?.refreshSuggestions();
    filterLocality.value?.refreshSuggestions();
    filterInstitution.value?.refreshSuggestions();
    emit("update");
  });
}
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
</script>

<template>
  <div>
    <v-form @submit.prevent="handleUpdate">
      <input-search v-model="query" />
      <search-actions class="mb-3" @click="handleReset" />
      <v-expansion-panels variant="accordion" multiple>
        <FilterInputAutocomplete
          ref="filterLocality"
          v-model="filters.locality.value"
          :title="$t('filters.locality')"
          :query-function="suggestLocality"
          :hydration-function="hydrateLocality"
          value="locality"
          @update:model-value="handleUpdate"
        />
        <FilterInputAutocomplete
          ref="filterCountry"
          v-model="filters.country.value"
          :title="$t('filters.country')"
          :query-function="suggestCountry"
          :hydration-function="hydrateCountry"
          value="country"
          @update:model-value="handleUpdate"
        />
        <filter-map
          v-model="filters.geometry.value"
          value="map"
          @update:model-value="handleUpdate"
        />
        <filter-input-text
          v-model="filters.people.value"
          :title="$t('filters.people')"
          value="people"
          @update:model-value="handleUpdate"
        />
        <filter-input-text
          v-model="filters.tags.value"
          :title="$t('filters.tags')"
          value="tags"
          @update:model-value="handleUpdate"
        />
        <filter-input-text
          v-model="filters.number.value"
          :title="$t('filters.number')"
          value="number"
          @update:model-value="handleUpdate"
        />
        <filter-input-range
          v-model="filters.size.value"
          :title="$t('filters.imageSize')"
          value="imageSize"
          @update:model-value="handleUpdate"
        />
        <filter-input-date
          v-model="filters.date.value"
          :title="$t('filters.date')"
          value="date"
          @update:model-value="handleUpdate"
        />
        <FilterInputAutocomplete
          ref="filterInstitution"
          v-model="filters.institution.value"
          :title="$t('filters.institution')"
          :query-function="suggestInstitution"
          :hydration-function="hydrateInstitution"
          value="institution"
          @update:model-value="handleUpdate"
        />
      </v-expansion-panels>
    </v-form>
  </div>
</template>
