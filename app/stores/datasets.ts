import { z } from "zod";
import type { RouteLocation } from "vue-router";
import type {
  IdListFilter,
  TextListFilter,
} from "~/composables/useFilter";

export const useDatasets = defineStore(
  "datasets",
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
      initOptions: DATASET.options,
      initHeaders: HEADERS_DATASET,
    });

    const { filters, solrFilters, reset: resetFilters } = useFilters({
      name: {
        value: [],
        type: "textList",
        lookup: "contains",
        fields: ["name", "name_en"],
      } as TextListFilter,
      owner: {
        value: [],
        type: "textList",
        lookup: "contains",
        fields: [
          "owner_id",
          "owner_agent",
          "owner_forename",
          "owner_surename",
          "owner_txt",
        ],
      } as TextListFilter,
      date: {
        value: [],
        type: "textList",
        lookup: "contains",
        fields: ["date", "date_txt"],
      } as TextListFilter,
      analysedParameter: {
        type: "idList",
        value: [],
        fields: ["parameter_index_list"],
        tag: "institution",
      } as IdListFilter,
      institution: {
        type: "idList",
        value: [],
        fields: ["database_id"],
        tag: "institution",
      } as IdListFilter,
    });

    const routeQueryFiltersSchema = z.object({
      q: z.string().catch(""),
      name: textParamParser,
      owner: textParamParser,
      date: textParamParser,
      analysedParameter: idParamParser(","),
      institution: idParamParser(","),
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
      owner: stringArrayValueParser,
      date: stringArrayValueParser,
      analysedParameter: idValueParser(","),
      institution: idValueParser(","),
    });

    const stateToQueryParamsSchema = optionsStateToQueryParamsSchema.merge(
      filtersStateToQueryParamsSchema,
    );

    function getQueryParams() {
      return stateToQueryParamsSchema.parse({
        q: query.value,
        name: filters.value.name.value,
        date: filters.value.date.value,
        owner: filters.value.owner.value,
        analysedParameter: filters.value.analysedParameter.value,
        institution: filters.value.institution.value,
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
