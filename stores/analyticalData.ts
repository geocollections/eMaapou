import type { RouteLocation } from "vue-router";
import { z } from "zod";
import { ANALYTICAL_DATA } from "~/constants";
import { HEADERS_ANALYTICAL_DATA } from "~/constants/headersNew";
import type {
  GeomFilter,
  IdListFilter,
  RangeFilter,
  StringIdListFilter,
} from "~/composables/useFilter";

console.log(HEADERS_ANALYTICAL_DATA);

export const useAnalyticalData = defineStore(
  "analyticalData",
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
    } = useDataTable({
      initOptions: ANALYTICAL_DATA.options,
      initHeaders: HEADERS_ANALYTICAL_DATA,
    });

    const resultsCount = ref(0);

    const { filters, solrFilters } = useFilters({
      depth: {
        type: "range",
        value: [null, null],
        placeholders: ["depth.min", "depth.max"],
        fields: ["depth", "depth_interval"],
      } as RangeFilter,
      stratigraphy: {
        type: "idList",
        value: [],
        fields: ["stratigraphy_hierarchy_descendent_paths"],
        tag: "stratigraphy",
        alphaNumeric: false,
      } as StringIdListFilter,
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
      project: {
        type: "idList",
        value: [],
        fields: ["project_id"],
        tag: "project",
      } as IdListFilter,
      reference: {
        type: "idList",
        value: [],
        fields: ["reference_id"],
        tag: "reference",
      } as IdListFilter,
      dataset: {
        type: "idList",
        value: [],
        fields: ["dataset_id"],
        tag: "dataset",
      } as IdListFilter,
      method: {
        type: "idList",
        value: [],
        fields: ["method_id"],
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
      geometry: {
        type: "geom",
        value: null,
        fields: ["latlong"],
      } as GeomFilter,
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
      locality: idParamParser(","),
      stratigraphy: idParamParser(","),
      institution: idParamParser(","),
      method: idParamParser(","),
      site: idParamParser(","),
      project: idParamParser(","),
      reference: idParamParser(","),
      dataset: idParamParser(","),
      lab: idParamParser(","),
      sample: idParamParser(","),
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
      depth: rangeValueParser,
      locality: idValueParser(","),
      stratigraphy: idValueParser(","),
      method: idValueParser(","),
      geometry: geometryValueParser,
      institution: idValueParser(","),
      site: idValueParser(","),
      reference: idValueParser(","),
      project: idValueParser(","),
      dataset: idValueParser(","),
      lab: idValueParser(","),
      sample: idValueParser(","),
    });

    const stateToQueryParamsSchema = optionsStateToQueryParamsSchema.merge(
      filtersStateToQueryParamsSchema,
    );

    function getQueryParams() {
      return stateToQueryParamsSchema.parse({
        q: query.value,
        locality: filters.value.locality.value,
        depth: filters.value.depth.value,
        stratigraphy: filters.value.stratigraphy.value,
        institution: filters.value.institution.value,
        method: filters.value.method.value,
        site: filters.value.site.value,
        project: filters.value.project.value,
        geometry: filters.value.geometry.value,
        reference: filters.value.reference.value,
        dataset: filters.value.dataset.value,
        sample: filters.value.sample.value,
        lab: filters.value.lab.value,
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
    };
  },
  {
    persist: {
      paths: ["options", "filters", "headers", "query"],
      storage: persistedState.sessionStorage,
    },
  },
);
