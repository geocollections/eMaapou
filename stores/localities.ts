import { z } from "zod";
import { LOCALITY, type SortItem } from "~/constants";
import { HEADERS_LOCALITY } from "~/constants/headers";
import uniq from "lodash/uniq";
import type { LocationQueryRaw } from "vue-router";
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

    const query = ref("");
    const solrQuery = computed(() => {
      return query.value.length > 0 ? query.value : "*";
    });

    const { headers, handleHeadersReset, handleHeadersChange } =
      useHeaders(HEADERS_LOCALITY);
    const options = ref(LOCALITY.options);

    const { locale } = useI18n();
    const solrSort = computed(() => {
      return getSolrSort({
        sortBy: options.value.sortBy,
        headersMap: HEADERS_LOCALITY.byIds,
        locale: locale.value as "et" | "en",
      });
    });

    const routeQuerySchemaOptions = z.object({
      page: z
        .string()
        .transform((val) => parseInt(val))
        .refine((val) => val > 0)
        .catch(1),
      itemsPerPage: z
        .string()
        .transform((val) => parseInt(val))
        .refine((val) => val > 0)
        .catch(25),
      sortBy: z
        .string()
        .transform((val): SortItem[] => {
          const sortStrings = val.split(",");
          return sortStrings
            .filter((sortString) => {
              const [_key, order] = sortString.split(" ");
              return order === "asc" || order === "desc";
            })
            .map((sortString): SortItem => {
              const [key, order] = sortString.split(" ");

              return {
                key,
                order: order as "asc" | "desc",
              };
            });
        })
        .catch([]),
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

    const routeQuerySchemaFilters = z.object({
      q: z.string().catch(""),
      name: z
        .string()
        .transform((val) => uniq(val.split(",")))
        .catch([]),
      country: z
        .string()
        .transform((val) => uniq(val.split(",").map((v) => v)))
        .catch([]),
      stratigraphyAge: z
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
      reference: z
        .string()
        .transform((val) => uniq(val.split(";").map((v) => v)))
        .catch([]),
      geometry: z
        .string()
        .transform((val) => JSON.parse(val))
        .catch(null),
    });

    const routeQuerySchema = routeQuerySchemaOptions.merge(
      routeQuerySchemaFilters,
    );

    function setStateFromQueryParams(route: RouteLocation) {
      const params = routeQuerySchema.parse(route.query);

      query.value = params.q;
      filters.value.name.value = params.name;
      filters.value.country.value = params.country;
      filters.value.reference.value = params.reference;
      filters.value.geometry.value = params.geometry;
      filters.value.stratigraphyAge.value = params.stratigraphyAge;
      options.value.page = params.page;
      options.value.itemsPerPage = params.itemsPerPage;
      options.value.sortBy = params.sortBy;
    }

    function getQueryParams() {
      const queryParams: LocationQueryRaw = {
        page: options.value.page.toString(),
        itemsPerPage: options.value.itemsPerPage.toString(),
      };

      if (query.value.length > 0) {
        queryParams.q = query.value;
      }
      if (filters.value.name.value.length > 0) {
        queryParams.name = filters.value.name.value.join(",");
      }
      if (filters.value.country.value.length > 0) {
        queryParams.country = filters.value.country.value.join(",");
      }
      if (filters.value.reference.value.length > 0) {
        queryParams.reference = filters.value.reference.value.join(";");
      }
      if (filters.value.geometry.value !== null) {
        queryParams.geometry = JSON.stringify(filters.value.geometry.value);
      }
      if (filters.value.stratigraphyAge.value.some((v) => v !== null)) {
        queryParams.stratigraphyAge = filters.value.stratigraphyAge.value
          .map((v) => (v === null ? "*" : v))
          .join("-");
      }

      if (options.value.sortBy.length > 0) {
        queryParams.sortBy = options.value.sortBy
          .map((sortItem) => `${sortItem.key} ${sortItem.order}`)
          .join(",");
      }

      return queryParams;
    }

    const { searchPosition, fromSearch } = useSearchPosition();

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
