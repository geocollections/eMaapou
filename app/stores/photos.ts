import { z } from "zod";
import type { RouteLocation } from "vue-router";
import type {
  DateListFilter,
  GeomFilter,
  IdListFilter,
  TextListFilter,
} from "~/composables/useFilter";
import { IMAGE } from "~/constants";
import { HEADERS_PHOTO } from "~/constants/headers";

export const usePhotos = defineStore(
  "photos",
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
      reset: resetDataTable,
    } = useDataTable({
      initOptions: IMAGE.options,
      initHeaders: HEADERS_PHOTO,
    });

    const view = ref(0);

    const { filters, solrFilters, reset: resetFilters } = useFilters({
      locality: {
        value: [],
        type: "idList",
        fields: ["locality_id"],
        tag: "locality",
      } as IdListFilter,
      country: {
        value: [],
        type: "idList",
        fields: ["country_id"],
        tag: "country",
      } as IdListFilter,
      geometry: {
        type: "geom",
        value: null,
        fields: ["latlong"],
      } as GeomFilter,
      people: {
        value: [],
        type: "textList",
        lookup: "contains",
        fields: ["image_people"],
      } as TextListFilter,
      number: {
        value: [],
        type: "textList",
        lookup: "contains",
        fields: ["image_number"],
      } as TextListFilter,
      tags: {
        value: [],
        type: "textList",
        lookup: "contains",
        fields: ["tags"],
      } as TextListFilter,
      author: {
        value: [],
        type: "idList",
        fields: ["author_id"],
        tag: "author",
      } as IdListFilter,
      date: {
        value: [],
        type: "dateList",
        fields: ["date_created"],
      } as DateListFilter,
      size: {
        value: [null, null],
        type: "range",
        fields: ["image_height", "image_width"],
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
      locality: idParamParser(","),
      country: idParamParser(","),
      geometry: geometryParamParser,
      people: textParamParser,
      tags: textParamParser,
      number: textParamParser,
      author: idParamParser(","),
      size: rangeParamParser,
      institution: idParamParser(","),
      date: dateArrayParamParser,
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
      locality: idValueParser(","),
      country: idValueParser(","),
      geometry: geometryValueParser,
      people: stringArrayValueParser,
      tags: stringArrayValueParser,
      number: stringArrayValueParser,
      author: idValueParser(","),
      size: rangeValueParser,
      institution: idValueParser(","),
      date: dateArrayValueParser,
    });

    const stateToQueryParamsSchema = optionsStateToQueryParamsSchema.merge(
      filtersStateToQueryParamsSchema,
    );

    function getQueryParams() {
      return stateToQueryParamsSchema.parse({
        q: query.value,
        locality: filters.value.locality.value,
        country: filters.value.country.value,
        geometry: filters.value.geometry.value,
        people: filters.value.people.value,
        tags: filters.value.tags.value,
        number: filters.value.number.value,
        author: filters.value.author.value,
        size: filters.value.size.value,
        institution: filters.value.institution.value,
        date: filters.value.date.value,
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
      currentView: view,
      resetFilters,
      resetDataTable,
    };
  },
  {
    persist: {
      pick: ["options", "filters", "headers", "query", "currentView"],
      storage: piniaPluginPersistedstate.sessionStorage(),
    },
  },
);
