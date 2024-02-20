import { z } from "zod";
import { DRILLCORE } from "~/constants";
import { HEADERS_DRILLCORE } from "~/constants/headersNew";
import type { RouteLocation } from "vue-router";
import type {
  IdListFilter,
  TextListFilter,
  StringIdListFilter,
  GeomFilter,
  RangeAltFilter,
  RangeFilter,
} from "~/composables/useFilter";

export const useDrillcores = defineStore(
  "drillcores",
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
      initOptions: DRILLCORE.options,
      initHeaders: HEADERS_DRILLCORE,
    });

    const { filters, solrFilters } = useFilters({
      name: {
        value: [],
        type: "textList",
        lookup: "contains",
        fields: ["drillcore", "drillcore_en"],
      } as TextListFilter,
      storage: {
        value: [],
        type: "textList",
        lookup: "contains",
        fields: ["location"],
      } as TextListFilter,
      country: {
        value: [],
        type: "idList",
        fields: ["country_id"],
        tag: "country",
      } as IdListFilter,
      repository: {
        value: [],
        type: "idList",
        fields: ["core_repository_id"],
        tag: "repository",
      } as IdListFilter,
      geometry: {
        type: "geom",
        value: null,
        fields: ["latlong"],
      } as GeomFilter,
      stratigraphyAge: {
        value: [null, null],
        type: "rangeAlt",
        fields: ["age_base", "age_top"],
      } as RangeAltFilter,
      boxes: {
        value: [null, null],
        type: "range",
        fields: ["boxes"],
      } as RangeFilter,
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
      storage: textParamParser,
      country: idParamParser(","),
      stratigraphyAge: rangeParamParser,
      boxes: rangeParamParser,
      repository: idParamParser(","),
      institution: idParamParser(","),
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
      name: stringArrayValueParser,
      storage: stringArrayValueParser,
      country: idValueParser(","),
      repository: idValueParser(","),
      institution: idValueParser(","),
      stratigraphyAge: rangeValueParser,
      boxes: rangeValueParser,
      geometry: geometryValueParser,
    });

    const stateToQueryParamsSchema = optionsStateToQueryParamsSchema.merge(
      filtersStateToQueryParamsSchema,
    );

    function getQueryParams() {
      return stateToQueryParamsSchema.parse({
        q: query.value,
        name: filters.value.name.value,
        storage: filters.value.storage.value,
        country: filters.value.country.value,
        stratigraphyAge: filters.value.stratigraphyAge.value,
        boxes: filters.value.boxes.value,
        repository: filters.value.repository.value,
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
