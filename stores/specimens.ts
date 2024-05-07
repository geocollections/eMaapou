import type { RouteLocation } from "vue-router";
import { z } from "zod";
import type {
  BooleanFilter,
  GeomFilter,
  IdListFilter,
  RangeFilter,
  StringIdListFilter,
  TextListFilter,
} from "~/composables/useFilter";

export const useSpecimens = defineStore(
  "specimens",
  () => {
    const route = useRoute();
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
      initOptions: SPECIMEN.options,
      initHeaders: HEADERS_SPECIMEN,
    });

    const imageOptions = ref({
      itemsPerPage: 25,
      page: 1,
    });

    function getView() {
      return route.query.view === "image" ? 1 : 0;
    }

    const view = ref(0);

    const { filters, solrFilters, reset: resetFilters } = useFilters({
      number: {
        type: "textList",
        value: [],
        fields: ["number"],
        lookup: "startswith",
      } as TextListFilter,
      locality: {
        type: "idList",
        value: [],
        fields: ["locality_id"],
        tag: "locality",
      } as IdListFilter,
      geometry: {
        type: "geom",
        value: null,
        fields: ["latlong"],
      } as GeomFilter,
      depth: {
        type: "range",
        value: [null, null],
        placeholders: ["depth.min", "depth.max"],
        fields: ["depth"],
      } as RangeFilter,
      stratigraphy: {
        type: "idList",
        value: [],
        fields: ["stratigraphy_hierarchy_descendent_paths"],
        tag: "stratigraphy",
        alphaNumeric: false,
      } as StringIdListFilter,
      rock: {
        type: "idList",
        value: [],
        fields: ["rock_hierarchy_descendent_paths"],
        alphaNumeric: false,
        tag: "rock",
      } as StringIdListFilter,
      taxon: {
        type: "idList",
        value: [],
        fields: ["taxon_hierarchy_descendent_paths"],
        alphaNumeric: false,
        tag: "taxon",
      } as StringIdListFilter,
      collector: {
        type: "idList",
        value: [],
        fields: ["collector_id"],
        tag: "collector",
      } as IdListFilter,
      collection: {
        type: "idList",
        value: [],
        fields: ["collection_id"],
        tag: "collection",
      } as IdListFilter,
      fossilGroup: {
        type: "idList",
        value: [],
        fields: ["fossilgroup_id"],
        tag: "fossilGroup",
      } as IdListFilter,
      country: {
        type: "idList",
        value: [],
        fields: ["country_id"],
        tag: "country",
      } as IdListFilter,
      originalStatus: {
        type: "idList",
        value: [],
        fields: ["original_status_id"],
        tag: "originalStatus",
      } as IdListFilter,
      institution: {
        type: "idList",
        value: [],
        fields: ["database_id"],
        tag: "institution",
      } as IdListFilter,
      hasImage: {
        type: "boolean",
        value: false,
        fields: ["has_image"],
      } as BooleanFilter,
      hasCoordinates: {
        type: "boolean",
        value: false,
        fields: ["has_map"],
      } as BooleanFilter,
      reference: {
        value: [],
        type: "idList",
        fields: ["specimen_references_kws"],
        tag: "references",
        alphaNumeric: true,
        lookup: "endswith",
      } as StringIdListFilter,
    });

    const routeQueryFiltersSchema = z.object({
      q: z.string().catch(""),
      number: textParamParser,
      locality: idParamParser(","),
      depth: rangeParamParser,
      stratigraphy: idParamParser(","),
      rock: idParamParser(","),
      taxon: idParamParser(","),
      collector: idParamParser(","),
      institution: idParamParser(","),
      collection: idParamParser(","),
      fossilGroup: idParamParser(","),
      country: idParamParser(","),
      originalStatus: idParamParser(","),
      geometry: geometryParamParser,
      hasImage: booleanParamParser,
      hasCoordinates: booleanParamParser,
      reference: idParamParser(";"),
    });

    const routeQuerySchema = routeQueryOptionsSchema.merge(
      routeQueryFiltersSchema,
    );

    function setStateFromQueryParams(route: RouteLocation) {
      const params = routeQuerySchema.parse(route.query);

      view.value = getView();

      if (view.value === 1) {
        imageOptions.value.page = params.page;
        imageOptions.value.itemsPerPage = params.itemsPerPage;
      }
      else {
        options.value.page = params.page;
        options.value.itemsPerPage = params.itemsPerPage;
      }

      options.value.sortBy = params.sortBy;

      query.value = params.q;

      Object.entries(filters.value).forEach(([key, filter]) => {
        filter.value = params[key as keyof typeof filters.value];
      });
    }

    const filtersStateToQueryParamsSchema = z.object({
      q: stringValueParser,
      number: stringArrayValueParser,
      locality: idValueParser(","),
      depth: rangeValueParser,
      stratigraphy: idValueParser(","),
      rock: idValueParser(","),
      taxon: idValueParser(","),
      collector: idValueParser(","),
      institution: idValueParser(","),
      collection: idValueParser(","),
      fossilGroup: idValueParser(","),
      country: idValueParser(","),
      originalStatus: idValueParser(","),
      reference: idValueParser(";"),
      geometry: geometryValueParser,
      hasImage: booleanValueParser,
      hasCoordinates: booleanValueParser,
    });

    const stateToQueryParamsSchema = optionsStateToQueryParamsSchema.merge(
      filtersStateToQueryParamsSchema,
    );

    function getViewOptions() {
      if (view.value === 1)
        return imageOptions.value;

      return options.value;
    }

    function getQueryParams() {
      const viewOptions = getViewOptions();

      return stateToQueryParamsSchema.parse({
        q: query.value,
        number: filters.value.number.value,
        locality: filters.value.locality.value,
        depth: filters.value.depth.value,
        stratigraphy: filters.value.stratigraphy.value,
        rock: filters.value.rock.value,
        taxon: filters.value.taxon.value,
        collector: filters.value.collector.value,
        institution: filters.value.institution.value,
        reference: filters.value.reference.value,
        geometry: filters.value.geometry.value,
        hasImage: filters.value.hasImage.value,
        hasCoordinates: filters.value.hasCoordinates.value,
        collection: filters.value.collection.value,
        fossilGroup: filters.value.fossilGroup.value,
        country: filters.value.country.value,
        originalStatus: filters.value.originalStatus.value,
        page: viewOptions.page,
        itemsPerPage: viewOptions.itemsPerPage,
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
      setStateFromQueryParams,
      getQueryParams,
      solrFilters,
      filters,
      resetFilters,
      resetDataTable,
      imageOptions,
      currentView: view,
    };
  },
  {
    persist: {
      paths: ["options", "filters", "headers", "query", "imageOptions", "currentView"],
      storage: persistedState.sessionStorage,
    },
  },
);
