import { z } from "zod";
import type { RouteLocation } from "vue-router";

import type { IdListFilter, StringIdListFilter, TextListFilter } from "~/composables/useFilter";

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
      reset: resetDataTable,
    } = useDataTable({
      initOptions: AREA.options,
      initHeaders: HEADERS_AREA,
    });

    const { filters, solrFilters, reset: resetFilters } = useFilters({
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
      size: {
        type: "range",
        value: [null, null],
        placeholders: ["size.min", "size.max"],
        fields: ["area_ha"],
      } as RangeFilter,
      miner: {
        value: [],
        type: "idList",
        fields: ["kaevandaja"],
        tag: "miner",
        lookup: "exact",
        alphaNumeric: false,
      } as StringIdListFilter,
      miningPermit: {
        value: [],
        type: "idList",
        fields: ["loa_number"],
        tag: "miningPermit",
        lookup: "exact",
        alphaNumeric: false,
      } as StringIdListFilter,
      miningPermitOwner: {
        value: [],
        type: "idList",
        fields: ["loa_omanik"],
        tag: "miningPermitOwner",
        lookup: "exact",
        alphaNumeric: false,
      } as StringIdListFilter,
    });

    const routeQueryFiltersSchema = z.object({
      q: z.string().catch(""),
      name: textParamParser,
      county: idParamParser(","),
      size: rangeParamParser,
      type: idParamParser(","),
      miner: idParamParser(","),
      miningPermit: idParamParser(","),
      miningPermitOwner: idParamParser(","),
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
      size: rangeValueParser,
      miner: idValueParser(","),
      miningPermit: idValueParser(","),
      miningPermitOwner: idValueParser(","),
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
        size: filters.value.size.value,
        miner: filters.value.miner.value,
        miningPermit: filters.value.miningPermit.value,
        miningPermitOwner: filters.value.miningPermitOwner.value,
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
