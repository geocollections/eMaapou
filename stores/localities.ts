import { z } from "zod";
import { LOCALITY } from "~/constants";
import { HEADERS_LOCALITY } from "~/constants/headers";
import type { RouteLocation } from "vue-router";
import type {
  IdListFilter,
  TextListFilter,
  StringIdListFilter,
  GeomFilter,
  RangeAltFilter,
} from "~/composables/useFilter";

export const useLocalities = defineStore(
  "localities",
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
      initOptions: LOCALITY.options,
      initHeaders: HEADERS_LOCALITY,
    });

    const { filters, solrFilters } = useFilters({
      name: {
        value: [],
        type: "textList",
        lookup: "contains",
        fields: ["locality", "locality_en"],
      } as TextListFilter,
      country: {
        value: [],
        type: "idList",
        fields: ["country_id"],
        tag: "country",
      } as IdListFilter,
      reference: {
        value: [],
        type: "idList",
        fields: ["locality_references_kws"],
        tag: "references",
        alphaNumeric: true,
      } as StringIdListFilter,
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
    });

    const routeQueryFiltersSchema = z.object({
      q: z.string().catch(""),
      name: textParamParser,
      country: idParamParser(","),
      stratigraphyAge: rangeParamParser,
      reference: idParamParser(";"),
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
      country: idValueParser(","),
      reference: idValueParser(";"),
      stratigraphyAge: rangeValueParser,
      geometry: geometryValueParser,
    });

    const stateToQueryParamsSchema = optionsStateToQueryParamsSchema.merge(
      filtersStateToQueryParamsSchema,
    );

    function getQueryParams() {
      return stateToQueryParamsSchema.parse({
        q: query.value,
        name: filters.value.name.value,
        country: filters.value.country.value,
        stratigraphyAge: filters.value.stratigraphyAge.value,
        reference: filters.value.reference.value,
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
