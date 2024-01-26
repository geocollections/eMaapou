<template>
  <div>
    <v-form @submit.prevent="handleUpdate">
      <input-search v-model="query" />
      <search-actions class="mb-3" @click="handleReset" />
      <v-expansion-panels variant="accordion" multiple>
        <filter-input-text
          v-model="filters.name.value"
          :title="$t('filters.localityName')"
          @update:model-value="handleUpdate"
        />
        <filter-input-autocomplete
          v-model="filters.country.value"
          ref="filterCountry"
          :title="$t('filters.country')"
          :query-function="querySuggestionsCountry"
          :hydration-function="hydrateSuggestionsCountry"
          @update:model-value="handleUpdate"
        />
        <filter-map
          v-model="filters.geometry.value"
          @update:model-value="handleUpdate"
        />
        <filter-input-range
          v-model="filters.stratigraphyAge.value"
          :title="$t('filters.stratigraphyAge')"
          @update:model-value="handleUpdate"
        />
        <filter-input-autocomplete
          v-model="filters.reference.value"
          ref="filterReferences"
          :title="$t('filters.reference')"
          :query-function="querySuggestionsReferences"
          :hydration-function="hydrateSuggestionsReferences"
          @update:model-value="handleUpdate"
        />
      </v-expansion-panels>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import type FilterInputAutocomplete from "~/components/filter/input/FilterInputAutocomplete.vue";

const emit = defineEmits(["update", "reset"]);

const filterCountry = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterReferences = ref<InstanceType<typeof FilterInputAutocomplete>>();

const localitiesStore = useLocalities();
const { filters, query, solrQuery, solrFilters } = storeToRefs(localitiesStore);

function handleReset() {
  emit("reset");
}
function handleUpdate() {
  nextTick(() => {
    filterCountry.value?.refreshSuggestions();
    filterReferences.value?.refreshSuggestions();
    emit("update");
  });
}

const { locale } = useI18n();
const { $solrFetch } = useNuxtApp();

async function querySuggestionsCountry({
  query,
  pagination,
  values,
}: {
  query: string;
  pagination: { page: number; perPage: number };
  values: string[];
}) {
  const nameField = locale.value === "et" ? "country" : "country_en";
  const pivot = `${nameField},country_id_s`;
  const res = await $solrFetch("/locality", {
    query: {
      facet: "true",
      "facet.pivot": `{!ex=country}${pivot}`,
      [`f.${nameField}.facet.contains`]: query,
      [`f.${nameField}.facet.contains.ignoreCase`]: true,
      [`f.${nameField}.facet.excludeTerms`]: values.join(","),
      "facet.limit": pagination.perPage,
      [`f.${nameField}.facet.offset`]:
        (pagination.page - 1) * pagination.perPage,
      json: {
        query: solrQuery.value,
        filter: solrFilters.value,
        limit: 0,
      },
    },
  });
  return res.facet_counts.facet_pivot[pivot].map((item: any) => ({
    id: item.pivot[0].value,
    name: item.value,
    count: item.count,
  }));
}

async function hydrateSuggestionsCountry(values: string[]) {
  const nameField = locale.value === "et" ? "country" : "country_en";

  const facets = values.reduce((prev, id) => {
    prev[id] = {
      type: "query",
      q: `country_id:${id}`,
      facet: {
        name: {
          type: "terms",
          field: nameField,
          limit: 1,
          domain: {
            query: "*:*",
            filter: `country_id:${id}`,
          },
        },
      },
    };
    return prev;
  }, {});

  const res = await $solrFetch("/locality", {
    query: {
      json: {
        limit: 0,
        query: solrQuery.value,
        filter: solrFilters.value,
        facet: {
          ...facets,
        },
      },
    },
  });

  return values.map((id) => ({
    id,
    name: res.facets[id].name.buckets[0].val,
    count: res.facets[id].count,
  }));
}
async function querySuggestionsReferences({
  query,
  pagination,
  values,
}: {
  query: string;
  pagination: { page: number; perPage: number };
  values: string[];
}) {
  const primaryField = "locality_references_kws";
  const pivot = `${primaryField},locality_references`;
  const res = await $solrFetch("/locality", {
    query: {
      facet: "true",
      "facet.pivot": `{!ex=references}${pivot}`,
      [`f.${primaryField}.facet.contains`]: removeNonAlphanumeric(query),
      [`f.${primaryField}.facet.contains.ignoreCase`]: true,
      [`f.${primaryField}.facet.excludeTerms`]: values
        .map(removeNonAlphanumeric)
        .join(","),
      "facet.limit": pagination.perPage,
      [`f.${primaryField}.facet.offset`]:
        (pagination.page - 1) * pagination.perPage,
      json: {
        query: solrQuery.value,
        filter: solrFilters.value,
        limit: 0,
      },
    },
  });
  return res.facet_counts.facet_pivot[pivot].map((item: any) => {
    return {
      id: item.value,
      name: item.pivot[0].value,
      count: item.count,
    };
  });
}
async function hydrateSuggestionsReferences(values: string[]) {
  const facets = values.reduce((prev, id) => {
    prev[id] = {
      type: "query",
      q: `locality_references_kws:"${id}"`,
      facet: {
        name: {
          type: "terms",
          field: "locality_references",
          limit: 1,
          domain: {
            query: "*:*",
            filter: `locality_references_kws:${id}`,
          },
        },
      },
    };
    return prev;
  }, {});

  const res = await $solrFetch("/locality", {
    query: {
      json: {
        limit: 0,
        query: solrQuery.value,
        filter: solrFilters.value,
        facet: {
          ...facets,
        },
      },
    },
  });

  return values.map((id) => {
    return {
      id,
      name: res.facets[id].name.buckets[0].val,
      count: res.facets[id].count,
    };
  });
}
</script>
