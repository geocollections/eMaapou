import type { RouteLocation } from "vue-router";
import { z } from "zod";
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

    const views = computed(() => ["table", "image"] as const);
    const view = ref("table" as "table" | "image");

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
      title: {
        value: [],
        type: "textList",
        lookup: "contains",
        fields: ["title", "title_en"],
      } as TextListFilter,
      description: {
        value: [],
        type: "textList",
        lookup: "contains",
        fields: ["description", "description_en"],
      } as TextListFilter,
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
      authorText: {
        value: [],
        type: "textList",
        lookup: "contains",
        fields: ["author_free"],
        tag: "authorText",
      } as TextListFilter,
      date: {
        value: [],
        type: "dateList",
        fields: ["date_created"],
        tag: "date",
      } as DateListFilter,
      dateText: {
        value: [],
        type: "textList",
        lookup: "contains",
        fields: ["date_created_free"],
        tag: "dateText",
      } as TextListFilter,
      place: {
        value: [],
        type: "textList",
        lookup: "contains",
        fields: ["image_place"],
        tag: "place",
      } as TextListFilter,
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
      title: textParamParser,
      description: textParamParser,
      tags: textParamParser,
      number: textParamParser,
      author: idParamParser(","),
      authorText: textParamParser,
      size: rangeParamParser,
      institution: idParamParser(","),
      date: dateArrayParamParser,
      dateText: textParamParser,
      place: textParamParser,
    });

    const routeQuerySchema = routeQueryOptionsSchema.merge(
      routeQueryFiltersSchema,
    ).merge(z.object({
      view: z.enum(views.value).catch("table" as const),
    }));

    function setStateFromQueryParams(route: RouteLocation) {
      const params = routeQuerySchema.parse(route.query);

      view.value = params.view;

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
      title: stringArrayValueParser,
      description: stringArrayValueParser,
      tags: stringArrayValueParser,
      number: stringArrayValueParser,
      author: idValueParser(","),
      authorText: stringArrayValueParser,
      size: rangeValueParser,
      institution: idValueParser(","),
      date: dateArrayValueParser,
      dateText: stringArrayValueParser,
      place: stringArrayValueParser,
    });

    const stateToQueryParamsSchema = optionsStateToQueryParamsSchema.merge(
      filtersStateToQueryParamsSchema,
    ).merge(z.object({
      view: z.enum(views.value),
    }));

    function getQueryParams() {
      return stateToQueryParamsSchema.parse({
        q: query.value,
        locality: filters.value.locality.value,
        country: filters.value.country.value,
        geometry: filters.value.geometry.value,
        people: filters.value.people.value,
        title: filters.value.title.value,
        description: filters.value.description.value,
        tags: filters.value.tags.value,
        number: filters.value.number.value,
        author: filters.value.author.value,
        authorText: filters.value.authorText.value,
        size: filters.value.size.value,
        institution: filters.value.institution.value,
        date: filters.value.date.value,
        dateText: filters.value.dateText.value,
        place: filters.value.place.value,
        page: options.value.page,
        itemsPerPage: options.value.itemsPerPage,
        sortBy: options.value.sortBy,
        view: view.value,
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
