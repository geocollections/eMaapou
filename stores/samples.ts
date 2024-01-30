import { HEADERS_SAMPLE, SAMPLE } from "~/constants";
import type { LocationQueryRaw, RouteLocation } from "vue-router";
import type {
  BooleanFilter,
  GeomFilter,
  IdListFilter,
  MultiHierarchyListFilter,
  RangeFilter,
  StringIdListFilter,
  TextListFilter,
} from "~/composables/useFilter";
import { z } from "zod";
import uniq from "lodash/uniq";

export const useSamples = defineStore(
  "samples",
  () => {
    const {
      query,
      options,
      headers,
      solrQuery,
      handleHeadersReset,
      handleHeadersChange,
      solrSort,
      routeQuerySchemaOptions,
    } = useDataTable({
      initOptions: SAMPLE.options,
      initHeaders: HEADERS_SAMPLE,
    });
    const resultsCount = ref(0);

    const { searchPosition, fromSearch } = useSearchPosition();

    const { filters, solrFilters } = useFilters({
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
        fields: [
          "stratigraphy_hierarchy",
          "age_hierarchy",
          "lithostratigraphy_hierarchy",
        ],
        tag: "stratigraphy",
        alphaNumeric: false,
      } as StringIdListFilter,
      rock: {
        type: "multiHierarchyList",
        value: [],
        fields: ["hierarchy_string_rock"],
        idField: "rock_id",
        tag: "rock",
      } as MultiHierarchyListFilter,
      collector: {
        type: "idList",
        value: [],
        fields: ["collector_id"],
        tag: "collector",
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
      institution: {
        type: "idList",
        value: [],
        fields: ["database_id"],
        tag: "institution",
      } as IdListFilter,
    });
    const routeQuerySchemaFilters = z.object({
      q: z.string().catch(""),
      number: z
        .string()
        .transform((val) => uniq(val.split(",")))
        .catch([]),
      locality: z
        .string()
        .transform((val) => uniq(val.split(",").map((v) => v)))
        .catch([]),
      depth: z
        .string()
        .transform((val, ctx) => {
          let [startStr, endStr] = val.split("-");
          const start = parseInt(startStr) || null;
          const end = parseInt(endStr) || null;

          if (start && end && start > end) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Start cannot be larger than end",
            });
            return z.NEVER;
          }

          return [start, end] as [null | number, null | number];
        })
        .catch([null, null]),
      stratigraphy: z
        .string()
        .transform((val) => uniq(val.split(",").map((v) => v)))
        .catch([]),
      rock: z
        .string()
        .transform((val) => uniq(val.split(",").map((v) => v)))
        .catch([]),
      collector: z
        .string()
        .transform((val) => uniq(val.split(",").map((v) => v)))
        .catch([]),
      institution: z
        .string()
        .transform((val) => uniq(val.split(",").map((v) => v)))
        .catch([]),
      geometry: z
        .string()
        .transform((val) => JSON.parse(val))
        .catch(null),
      hasImage: z
        .string()
        .transform((val) => val === "true")
        .catch(false),
      hasCoordinates: z
        .string()
        .transform((val) => val === "true")
        .catch(false),
    });

    const routeQuerySchema = routeQuerySchemaOptions.merge(
      routeQuerySchemaFilters,
    );

    function setStateFromQueryParams(route: RouteLocation) {
      const params = routeQuerySchema.parse(route.query);

      options.value.page = params.page;
      options.value.itemsPerPage = params.itemsPerPage;
      options.value.sortBy = params.sortBy;

      query.value = params.q;
      filters.value.number.value = params.number;
      filters.value.locality.value = params.locality;
      filters.value.depth.value = params.depth;
      filters.value.stratigraphy.value = params.stratigraphy;
      filters.value.rock.value = params.rock;
      filters.value.collector.value = params.collector;
      filters.value.institution.value = params.institution;
      filters.value.geometry.value = params.geometry;
      filters.value.hasImage.value = params.hasImage;
      filters.value.hasCoordinates.value = params.hasCoordinates;
    }

    function getQueryParams() {
      const queryParams: LocationQueryRaw = {
        page: options.value.page.toString(),
        itemsPerPage: options.value.itemsPerPage.toString(),
      };

      if (options.value.sortBy.length > 0) {
        queryParams.sortBy = options.value.sortBy
          .map((sortItem) => `${sortItem.key} ${sortItem.order}`)
          .join(",");
      }
      if (query.value.length > 0) {
        queryParams.q = query.value;
      }
      if (filters.value.number.value.length > 0) {
        queryParams.number = filters.value.number.value.join(",");
      }
      if (filters.value.locality.value.length > 0) {
        queryParams.locality = filters.value.locality.value.join(",");
      }
      if (filters.value.depth.value.some((v) => v !== null)) {
        queryParams.depth = filters.value.depth.value
          .map((v) => (v === null ? "*" : v))
          .join("-");
      }
      if (filters.value.stratigraphy.value.length > 0) {
        queryParams.stratigraphy = filters.value.stratigraphy.value.join(",");
      }
      if (filters.value.rock.value.length > 0) {
        queryParams.rock = filters.value.rock.value.join(",");
      }
      if (filters.value.collector.value.length > 0) {
        queryParams.collector = filters.value.collector.value.join(",");
      }
      if (filters.value.institution.value.length > 0) {
        queryParams.institution = filters.value.institution.value.join(",");
      }
      if (filters.value.geometry.value !== null) {
        queryParams.geometry = JSON.stringify(filters.value.geometry.value);
      }
      if (filters.value.hasImage.value) {
        queryParams.hasImage = "true";
      }
      if (filters.value.hasCoordinates.value) {
        queryParams.hasCoordinates = "true";
      }

      return queryParams;
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
      resultsCount,
      searchPosition,
      fromSearch,
      solrFilters,
      filters,
    };
  },
  {
    persist: {
      paths: ["options", "filters", "headers", "query", "searchPosition"],
      storage: persistedState.sessionStorage,
    },
  },
);
