import { z } from "zod";
import type { RouteLocation } from "vue-router";
import { SITE } from "~/constants";
import { HEADERS_SITE } from "~/constants/headersNew";
import type {
  GeomFilter,
  IdListFilter,
  TextListFilter,
} from "~/composables/useFilter";

export const useSites = defineStore(
  "sites",
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
      initOptions: SITE.options,
      initHeaders: HEADERS_SITE,
    });

    const { filters, solrFilters } = useFilters({
      name: {
        value: [],
        type: "textList",
        lookup: "contains",
        fields: ["name"],
      } as TextListFilter,
      geometry: {
        type: "geom",
        value: null,
        fields: ["latlong"],
      } as GeomFilter,
      area: {
        value: [],
        type: "idList",
        fields: ["area_id"],
        tag: "area",
      } as IdListFilter,
      project: {
        value: [],
        type: "idList",
        fields: ["project_id"],
        tag: "project",
      } as IdListFilter,
    });

    const routeQuerySchemaFilters = z.object({
      q: z.string().catch(""),
      name: textParamParser,
      area: idParamParser(","),
      project: idParamParser(","),
      geometry: geometryParamParser,
    });

    const routeQuerySchema = routeQueryOptionsSchema.merge(
      routeQuerySchemaFilters,
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
      area: idValueParser(","),
      project: idValueParser(","),
      geometry: geometryValueParser,
    });

    const stateToQueryParamsSchema = optionsStateToQueryParamsSchema.merge(
      filtersStateToQueryParamsSchema,
    );

    function getQueryParams() {
      return stateToQueryParamsSchema.parse({
        q: query.value,
        name: filters.value.name.value,
        area: filters.value.area.value,
        project: filters.value.project.value,
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
