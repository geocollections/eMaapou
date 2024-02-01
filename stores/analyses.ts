import { z } from "zod";
import { ANALYSIS } from "~/constants";
import { HEADERS_ANALYSIS } from "~/constants/headers";
import type { RouteLocation } from "vue-router";
import type {
  IdListFilter,
  TextListFilter,
  StringIdListFilter,
  GeomFilter,
  RangeFilter,
} from "~/composables/useFilter";

export const useAnalyses = defineStore(
  "analyses",
  () => {
    const resultsCount = ref(0);
    const { searchPosition, fromSearch } = useSearchPosition();

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
      initOptions: ANALYSIS.options,
      initHeaders: HEADERS_ANALYSIS,
    });

    const { filters, solrFilters } = useFilters({
      depth: {
        type: "range",
        value: [null, null],
        placeholders: ["depth.min", "depth.max"],
        fields: ["depth"],
      } as RangeFilter,
      method: {
        type: "idList",
        value: [],
        fields: ["method"],
        tag: "method",
      } as IdListFilter,
      lab: {
        type: "idList",
        value: [],
        fields: ["lab_id"],
        tag: "lab",
      } as IdListFilter,
      sample: {
        type: "idList",
        value: [],
        fields: ["sample_id"],
        tag: "sample",
      } as IdListFilter,
      locality: {
        type: "idList",
        value: [],
        fields: ["locality_id"],
        tag: "locality",
      } as IdListFilter,
      site: {
        type: "idList",
        value: [],
        fields: ["site_id"],
        tag: "site",
      } as IdListFilter,
      geometry: {
        type: "geom",
        value: null,
        fields: ["latlong"],
      } as GeomFilter,
      agent: {
        type: "textList",
        value: [],
        fields: ["agent"],
        lookup: "startswith",
      } as TextListFilter,
      institution: {
        type: "idList",
        value: [],
        fields: ["database_id"],
        tag: "institution",
      } as IdListFilter,
    });

    const routeQueryFiltersSchema = z.object({
      q: z.string().catch(""),
      depth: rangeParamParser,
      method: idParamParser(","),
      lab: idParamParser(","),
      sample: idParamParser(","),
      locality: idParamParser(","),
      site: idParamParser(","),
      geometry: geometryParamParser,
      agent: textParamParser,
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
      geometry: geometryValueParser,
      depth: rangeValueParser,
      method: idValueParser(","),
      lab: idValueParser(","),
      sample: idValueParser(","),
      locality: idValueParser(","),
      site: idValueParser(","),
      agent: stringArrayValueParser,
      institution: idValueParser(","),
    });

    const stateToQueryParamsSchema = optionsStateToQueryParamsSchema.merge(
      filtersStateToQueryParamsSchema,
    );

    function getQueryParams() {
      return stateToQueryParamsSchema.parse({
        q: query.value,
        depth: filters.value.depth.value,
        method: filters.value.method.value,
        lab: filters.value.lab.value,
        sample: filters.value.sample.value,
        locality: filters.value.locality.value,
        site: filters.value.site.value,
        agent: filters.value.agent.value,
        institution: filters.value.institution.value,
        geometry: filters.value.geometry.value,
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
      searchPosition,
      fromSearch,
      resultsCount,
    };
  },
  {
    persist: {
      paths: ["options", "filters", "headers", "query", "searchPosition"],
      storage: persistedState.sessionStorage,
    },
  },
);
