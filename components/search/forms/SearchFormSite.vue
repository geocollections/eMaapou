<template>
  <div>
    <v-form @submit.prevent="handleUpdate">
      <input-search v-model="query" />
      <search-actions class="mb-3" @click="handleReset" />
      <v-expansion-panels variant="accordion" multiple>
        <filter-input-text
          v-model="filters.name.value"
          :title="$t('filters.name')"
          @update:model-value="handleUpdate"
          value="name"
        />
        <filter-input-autocomplete
          v-model="filters.area.value"
          ref="filterArea"
          :title="$t('filters.area')"
          :query-function="suggestArea"
          :hydration-function="hydrateArea"
          @update:model-value="handleUpdate"
          value="area"
        />
        <filter-input-autocomplete
          v-model="filters.project.value"
          ref="filterProject"
          :title="$t('filters.project')"
          :query-function="suggestProject"
          :hydration-function="hydrateProject"
          @update:model-value="handleUpdate"
          value="project"
        />
        <filter-map
          v-model="filters.geometry.value"
          @update:model-value="handleUpdate"
          value="map"
        />
      </v-expansion-panels>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import type { FilterInputAutocomplete } from "#build/components";

const emit = defineEmits(["update", "reset"]);
const sitesStore = useSites();
const { filters, query, solrQuery, solrFilters } = storeToRefs(sitesStore);

const { suggest: suggestArea, hydrate: hydrateArea } = useAutocomplete(
  "/site",
  {
    idField: "area_id_s",
    nameField: { et: "area_name", en: "area_name_en" },
    filterExclude: "area",
    solrParams: { query: solrQuery, filter: solrFilters },
  },
);
const { suggest: suggestProject, hydrate: hydrateProject } = useAutocomplete(
  "/site",
  {
    idField: "project_id_s",
    nameField: { et: "project_name", en: "project_name_en" },
    filterExclude: "project",
    solrParams: { query: solrQuery, filter: solrFilters },
  },
);

const filterArea = ref<InstanceType<typeof FilterInputAutocomplete>>();
const filterProject = ref<InstanceType<typeof FilterInputAutocomplete>>();

function handleReset() {
  emit("reset");
}
function handleUpdate() {
  nextTick(() => {
    filterArea.value?.refreshSuggestions();
    filterProject.value?.refreshSuggestions();
    emit("update");
  });
}
// export default defineComponent({
//   name: "SearchFormSite",
//   components: {
//     SearchActions,
//     FilterInputText,
//     FilterMap,
//     InputSearch,
//     FilterInputAutocompleteNew,
//   },
//   setup(_props, { emit }) {
//     const hydrateFilter = useHydrateFilterNew();
//     const hydrateStatic = useHydrateStatic();
//     const hydrate = useHydrate();
//     const hydrateProject = hydrateStatic(filters.value.project, query, {
//       pivot: ["project_id", "project_name", "project_name_en"],
//       countResourceRelatedIdKey: "project_id",
//       countResource: "site",
//       countHierarchical: false,
//       filters,
//       tagFilterKey: "project",
//     });
//     const hydrateArea = hydrate(
//       filters.value.area,
//       query,
//       {
//         itemResource: "area",
//         itemFields: ["id", "name", "name_en"],
//         itemSearchField: "id",
//         countResource: "site",
//         countResourceRelatedIdKey: "area_id",
//         countHierarchical: false,
//         tagFilterKey: "area",
//         filters,
//       },
//       (items, counts) =>
//         items.map((item: any) => ({
//           id: parseInt(item.id),
//           text: item.name,
//           text_en: item.name_en,
//           count: counts[item.id],
//         })),
//     );
//     const querySuggestionsStatic = useQuerySuggestionsStatic();
//     const querySuggestionsProject = querySuggestionsStatic(query, {
//       resource: "site",
//       excludeFilterKey: "project",
//       pivot: ["project_id", "project_name", "project_name_en"],
//       limit: 200,
//       filters,
//     });
//     const querySuggestions = useQuerySuggestions();
//     const querySuggestionsArea = querySuggestions(query, {
//       resource: "site",
//       pivot: ["area_id", "area_name", "area_name_en"],
//       pivotOffsetField: "area_id",
//       countHierarchical: false,
//       countResourceRelatedKey: "area_id",
//       excludeFilterKey: "area",
//       filters,
//     });
//     return {
//       querySuggestionsProject,
//       querySuggestionsArea,
//       query,
//       name,
//       area,
//       map,
//       project,
//       handleReset,
//       handleUpdate,
//     };
//   },
// });
</script>
