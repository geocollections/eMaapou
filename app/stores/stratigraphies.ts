import { z } from "zod";
import type { RouteLocation } from "vue-router";
import type {
  IdListFilter,
  StringIdListFilter,
  TextListFilter,
} from "~/composables/useFilter";
import { STRATIGRAPHY } from "~/constants";

export const useStratigraphies = defineStore(
  "stratigraphies",
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
      initOptions: STRATIGRAPHY.options,
      initHeaders: HEADERS_STRATIGRAPHY,
    });

    const resultsCount = ref(0);

    const { filters, solrFilters, reset: resetFilters } = useFilters({
      stratigraphy: {
        type: "idList",
        value: [],
        fields: ["stratigraphy_hierarchy_descendent_paths"],
        tag: "stratigraphy",
        alphaNumeric: false,
      } as StringIdListFilter,
      type: {
        type: "idList",
        value: [],
        fields: ["type"],
        tag: "type",
      } as IdListFilter,
      scope: {
        type: "idList",
        value: [],
        fields: ["scope"],
        tag: "scope",
      } as IdListFilter,
      rank: {
        type: "idList",
        value: [],
        fields: ["rank"],
        tag: "rank",
      } as IdListFilter,
      index: {
        type: "textList",
        value: [],
        fields: ["index_main", "index_additional"],
      } as TextListFilter,
      age: {
        type: "rangeAlt",
        value: [null, null],
        placeholders: ["stratigraphy.min", "stratigraphy.max"],
        fields: ["age_base", "age_top"],
      } as RangeAltFilter,
    });

    const routeQueryFiltersSchema = z.object({
      q: z.string().catch(""),
      index: textParamParser,
      age: rangeParamParser,
      stratigraphy: idParamParser(","),
      type: idParamParser(","),
      scope: idParamParser(","),
      rank: idParamParser(","),
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
      index: stringArrayValueParser,
      age: rangeValueParser,
      stratigraphy: idValueParser(","),
      type: idValueParser(","),
      scope: idValueParser(","),
      rank: idValueParser(","),
    });

    const stateToQueryParamsSchema = optionsStateToQueryParamsSchema.merge(
      filtersStateToQueryParamsSchema,
    );

    function getQueryParams() {
      return stateToQueryParamsSchema.parse({
        q: query.value,
        index: filters.value.index.value,
        age: filters.value.age.value,
        stratigraphy: filters.value.stratigraphy.value,
        type: filters.value.type.value,
        scope: filters.value.type.value,
        rank: filters.value.type.value,
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
