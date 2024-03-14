import type { RouteLocation } from "vue-router";
import { z } from "zod";
import type {
  BooleanFilter,
  GeomFilter,
  IdListFilter,
  RangeFilter,
  StringIdListFilter,
  TextListFilter,
} from "~/composables/useFilter";

export const useTaxa = defineStore(
  "taxa",
  () => {
    const {
      query,
      options,
      headers,
      solrQuery,
      handleHeadersReset,
      handleHeadersChange,
      solrSort,
      routeQueryOptionsSchema,
      stateToQueryParamsSchema: optionsStateToQueryParamsSchema,
      reset: resetDataTable,
    } = useDataTable({
      initOptions: TAXON.options,
      initHeaders: HEADERS_TAXON,
    });

    const resultsCount = ref(0);

    const { filters, solrFilters, reset: resetFilters } = useFilters({
      species: {
        type: "textList",
        value: [],
        fields: ["taxon"],
      } as TextListFilter,
      taxon: {
        type: "idList",
        value: [],
        fields: ["taxon_hierarchy_descendent_paths"],
        alphaNumeric: false,
        tag: "taxon",
      } as StringIdListFilter,
      geometry: {
        type: "geom",
        value: null,
        fields: ["latlong"],
      } as GeomFilter,
      author: {
        type: "textList",
        value: [],
        fields: ["author_year"],
      } as TextListFilter,
    });

    const routeQueryFiltersSchema = z.object({
      q: z.string().catch(""),
      species: textParamParser,
      taxon: idParamParser(","),
      author: textParamParser,
      geometry: geometryParamParser,
    });

    const routeQuerySchema = routeQueryOptionsSchema.merge(
      routeQueryFiltersSchema,
    );

    function setStateFromQueryParamsTest(route: RouteLocation) {
      const params = routeQuerySchema.parse(route.query);

      options.value.page = params.page;
      options.value.itemsPerPage = params.itemsPerPage;
      options.value.sortBy = params.sortBy;

      query.value = params.q;

      Object.entries(filters.value).forEach(([key, filter]) => {
        filter.value = params[key as keyof typeof filters.value];
      });
    }

    const filtersStateToQueryParamsSchema = z.object({
      q: stringValueParser,
      species: stringArrayValueParser,
      taxon: idValueParser(","),
      author: stringArrayValueParser,
      geometry: geometryValueParser,
    });

    const stateToQueryParamsSchema = optionsStateToQueryParamsSchema.merge(
      filtersStateToQueryParamsSchema,
    );

    function getQueryParams() {
      return stateToQueryParamsSchema.parse({
        q: query.value,
        species: filters.value.species.value,
        taxon: filters.value.taxon.value,
        author: filters.value.author.value,
        geometry: filters.value.geometry.value,
        page: options.value.page,
        itemsPerPage: options.value.itemsPerPage,
        sortBy: options.value.sortBy,
      });
    }

    return {
      query,
      solrQuery,
      solrSort,
      headers,
      handleHeadersReset,
      handleHeadersChange,
      options,
      setStateFromQueryParams: setStateFromQueryParamsTest,
      getQueryParams,
      resultsCount,
      solrFilters,
      filters,
      resetFilters,
      resetDataTable,
    };
  },
  {
    persist: {
      paths: ["options", "filters", "headers", "query"],
      storage: persistedState.sessionStorage,
    },
  },
);
