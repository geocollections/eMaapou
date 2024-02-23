import { z } from "zod";
import type { RouteLocation } from "vue-router";
import { AREA } from "~/constants";
import { HEADERS_AREA } from "~/constants/headersNew";

import type { IdListFilter, TextListFilter } from "~/composables/useFilter";

export const useAreas = defineStore(
  "areas",
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
    } = useDataTable({
      initOptions: AREA.options,
      initHeaders: HEADERS_AREA,
    });

    const { filters, solrFilters } = useFilters({
      name: {
        value: [],
        type: "textList",
        lookup: "contains",
        fields: ["name", "name_en"],
      } as TextListFilter,
      county: {
        value: [],
        type: "idList",
        fields: ["maakond_id"],
        tag: "county",
      } as IdListFilter,
      type: {
        value: [],
        type: "idList",
        fields: ["area_type_id"],
        tag: "type",
      } as IdListFilter,
    });

    const routeQueryFiltersSchema = z.object({
      q: z.string().catch(""),
      name: textParamParser,
      county: idParamParser(","),
      type: idParamParser(","),
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
      name: stringArrayValueParser,
      county: idValueParser(","),
      type: idValueParser(","),
    });

    const stateToQueryParamsSchema = optionsStateToQueryParamsSchema.merge(
      filtersStateToQueryParamsSchema,
    );

    function getQueryParams() {
      return stateToQueryParamsSchema.parse({
        q: query.value,
        name: filters.value.name.value,
        county: filters.value.county.value,
        type: filters.value.type.value,
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
    };
  },
  {
    persist: {
      paths: ["options", "filters", "headers", "query"],
      storage: persistedState.sessionStorage,
    },
  },
);
