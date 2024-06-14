import { z } from "zod";
import type { RouteLocation } from "vue-router";
import type {
  GeomFilter,
  IdListFilter,
  RangeFilter,
  StringIdListFilter,
  TextListFilter,
} from "~/composables/useFilter";

export const usePreparations = defineStore(
  "preparations",
  () => {
    const resultsCount = ref(0);

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
      initOptions: PREPARATION.options,
      initHeaders: HEADERS_PREPARATION,
    });

    const { filters, solrFilters, reset: resetFilters } = useFilters({
      number: {
        type: "textList",
        value: [],
        fields: ["preparation_number"],
        lookup: "startswith",
      } as TextListFilter,
      locality: {
        type: "idList",
        value: [],
        fields: ["locality_id"],
        tag: "locality",
      } as IdListFilter,
      geometry: {
        type: "geom",
        value: null,
        fields: ["latlong"],
      } as GeomFilter,
      depth: {
        type: "range",
        value: [null, null],
        placeholders: ["depth.min", "depth.max"],
        fields: ["depth"],
      } as RangeFilter,
      stratigraphy: {
        type: "idList",
        value: [],
        fields: [
          "stratigraphy_hierarchy",
          "age_hierarchy",
          "lithostratigraphy_hierarchy",
        ],
        tag: "stratigraphy",
        alphaNumeric: false,
      } as StringIdListFilter,
      hasImage: {
        type: "boolean",
        value: false,
        fields: ["has_image"],
      } as BooleanFilter,
    });

    const routeQueryFiltersSchema = z.object({
      q: z.string().catch(""),
      number: textParamParser,
      locality: idParamParser(","),
      depth: rangeParamParser,
      stratigraphy: idParamParser(","),
      hasImage: booleanParamParser,
      geometry: geometryParamParser,
    });

    const routeQuerySchema = routeQueryOptionsSchema.merge(
      routeQueryFiltersSchema,
    );

    function setStateFromQueryParams(route: RouteLocation) {
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
      number: stringArrayValueParser,
      locality: idValueParser(","),
      depth: rangeValueParser,
      stratigraphy: idValueParser(","),
      geometry: geometryValueParser,
      hasImage: booleanValueParser,
    });

    const stateToQueryParamsSchema = optionsStateToQueryParamsSchema.merge(
      filtersStateToQueryParamsSchema,
    );

    function getQueryParams() {
      return stateToQueryParamsSchema.parse({
        q: query.value,
        number: filters.value.number.value,
        locality: filters.value.locality.value,
        depth: filters.value.depth.value,
        stratigraphy: filters.value.stratigraphy.value,
        geometry: filters.value.geometry.value,
        hasImage: filters.value.hasImage.value,
        page: options.value.page,
        itemsPerPage: options.value.itemsPerPage,
        sortBy: options.value.sortBy,
      });
    }

    return {
      query,
      solrQuery,
      filters,
      solrFilters,
      solrSort,
      headers,
      handleHeadersChange,
      handleHeadersReset,
      options,
      setStateFromQueryParams,
      getQueryParams,
      resultsCount,
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
