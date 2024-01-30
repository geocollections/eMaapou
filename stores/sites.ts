import { z } from "zod";
import { SITE, type SortItem } from "~/constants";
import { HEADERS_SITE } from "~/constants/headers";
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

export const useSites = defineStore(
  "sites",
  () => {
    const resultsCount = ref(0);

    const query = ref("");
    const solrQuery = computed(() => {
      return query.value.length > 0 ? query.value : "*";
    });

    const { headers, handleHeadersReset, handleHeadersChange } =
      useHeaders(HEADERS_SITE);
    const options = ref(SITE.options);

    const { locale } = useI18n();
    const solrSort = computed(() => {
      return getSolrSort({
        sortBy: options.value.sortBy,
        headersMap: HEADERS_SITE.byIds,
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
      name: z
        .string()
        .transform((val) => uniq(val.split(",")))
        .catch([]),
      area: z
        .string()
        .transform((val) => uniq(val.split(",").map((v) => v)))
        .catch([]),
      project: z
        .string()
        .transform((val) => uniq(val.split(",").map((v) => v)))
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
      filters.value.area.value = params.area;
      filters.value.project.value = params.project;
      filters.value.geometry.value = params.geometry;
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
      if (filters.value.geometry.value !== null) {
        queryParams.geometry = JSON.stringify(filters.value.geometry.value);
      }
      if (filters.value.area.value.length > 0) {
        queryParams.area = filters.value.area.value.join(",");
      }
      if (filters.value.project.value.length > 0) {
        queryParams.project = filters.value.project.value.join(",");
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
