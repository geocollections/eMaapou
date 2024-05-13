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

export const useSamples = defineStore(
  "samples",
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
      initOptions: SAMPLE.options,
      initHeaders: HEADERS_SAMPLE,
    });

    const resultsCount = ref(0);

    const { filters, solrFilters, reset: resetFilters } = useFilters({
      number: {
        type: "textList",
        value: [],
        fields: ["number"],
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
        fields: ["stratigraphy_hierarchy_descendent_paths"],
        tag: "stratigraphy",
        alphaNumeric: false,
      } as StringIdListFilter,
      rock: {
        type: "idList",
        value: [],
        fields: ["rock_hierarchy_descendent_paths"],
        alphaNumeric: false,
        tag: "rock",
      } as StringIdListFilter,
      collector: {
        type: "idList",
        value: [],
        fields: ["collector_id"],
        tag: "collector",
      } as IdListFilter,
      hasImage: {
        type: "boolean",
        value: false,
        fields: ["has_image"],
      } as BooleanFilter,
      hasCoordinates: {
        type: "boolean",
        value: false,
        fields: ["has_map"],
      } as BooleanFilter,
      institution: {
        type: "idList",
        value: [],
        fields: ["database_id"],
        tag: "institution",
      } as IdListFilter,
    });

    const routeQueryFiltersSchema = z.object({
      q: z.string().catch(""),
      number: textParamParser,
      locality: idParamParser(","),
      depth: rangeParamParser,
      stratigraphy: idParamParser(","),
      rock: idParamParser(","),
      collector: idParamParser(","),
      institution: idParamParser(","),
      geometry: geometryParamParser,
      hasImage: booleanParamParser,
      hasCoordinates: booleanParamParser,
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
      number: stringArrayValueParser,
      locality: idValueParser(","),
      depth: rangeValueParser,
      stratigraphy: idValueParser(","),
      rock: idValueParser(","),
      collector: idValueParser(","),
      institution: idValueParser(","),
      geometry: geometryValueParser,
      hasImage: booleanValueParser,
      hasCoordinates: booleanValueParser,
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
        rock: filters.value.rock.value,
        collector: filters.value.collector.value,
        institution: filters.value.institution.value,
        geometry: filters.value.geometry.value,
        hasImage: filters.value.hasImage.value,
        hasCoordinates: filters.value.hasCoordinates.value,
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
