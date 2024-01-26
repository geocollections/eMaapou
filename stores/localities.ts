import { z } from "zod";
import { LOCALITY, type SortItem } from "~/constants";
import { HEADERS_LOCALITY } from "~/constants/headers";
import uniq from "lodash/uniq";
import cloneDeep from "lodash/cloneDeep";
import type { LocationQueryRaw } from "vue-router";
import type { RouteLocation } from "vue-router";
import earcut from "earcut";
import { geojsonToWKT } from "@terraformer/wkt";

type LookupType = "contains" | "exact" | "startswith" | "endswith";
type FilterType = "text" | "idList" | "textList" | "geom" | "rangeAlt";

type BaseFilter = {
  type: FilterType;
  value: any;
  fields: string[];
  tag?: string;
};

type TextFilter = Omit<BaseFilter, "value"> & {
  type: "text";
  lookup?: LookupType;
  value: string;
};
type TextListFilter = Omit<BaseFilter, "value"> & {
  type: "textList";
  lookup?: LookupType;
  value: string[];
};

type IdListFilter = Omit<BaseFilter, "value"> & {
  type: "idList";
  value: string[];
};

type StringIdListFilter = Omit<BaseFilter, "value"> & {
  type: "idList";
  value: string[];
  lookup?: LookupType;
};

type GeomFilter = Omit<BaseFilter, "value"> & {
  type: "geom";
  value: null | any;
};
type RangeAltFilter = Omit<BaseFilter, "value"> & {
  type: "rangeAlt";
  value: [null | number, null | number];
};

type FilterUnion =
  | TextFilter
  | TextListFilter
  | IdListFilter
  | StringIdListFilter
  | GeomFilter
  | RangeAltFilter;

function getLookupFn(
  lookup: LookupType | undefined
): (field: string, value: string) => string {
  switch (lookup) {
    case "contains":
      return (field, value) => `${field}:*${value}*`;
    case "exact":
      return (field, value) => `${field}:"${value}"`;
    case "startswith":
      return (field, value) => `${field}:${value}*`;
    case "endswith":
      return (field, value) => `${field}:*${value}`;
    default:
      return (field, value) => `${field}:${value}`;
  }
}

function isStringArray(x: any[]): x is string[] {
  return x.every((i) => typeof i === "string");
}

function isStringIdListFilter(
  filter: FilterUnion
): filter is StringIdListFilter {
  return filter.type === "idList" && isStringArray(filter.value);
}

function isValidFilter(filter: FilterUnion): boolean {
  switch (filter.type) {
    case "text":
      return filter.value.length > 0;
    case "textList":
      return filter.value.length > 0;
    case "idList":
      return filter.value.length > 0;
    case "rangeAlt":
      return filter.value.some((value) => value !== null);
    case "geom": {
      return filter.value !== null;
    }
    default:
      return false;
  }
}

function getSolrFilter(filter: FilterUnion) {
  switch (filter.type) {
    case "text": {
      const lookupFn = getLookupFn(filter.lookup);
      return filter.fields
        .map((field) => lookupFn(field, filter.value))
        .join(" OR ");
    }
    case "textList": {
      const lookupFn = getLookupFn(filter.lookup);
      return filter.fields
        .map((field) =>
          filter.value.map((v) => lookupFn(field, v)).join(" OR ")
        )
        .join(" OR ");
    }
    case "rangeAlt": {
      return filter.value
        .filter((value) => value !== null)
        .map((value) => {
          return `(${filter.fields[0]}: [${value} TO *] AND ${filter.fields[1]}: [* TO ${value}])`;
        })
        .join(" OR ");
    }
    case "idList": {
      if (isStringIdListFilter(filter)) {
        const lookupFn = getLookupFn(filter.lookup);
        return filter.fields
          .map((field) =>
            filter.value
              .map((v) => {
                return lookupFn(field, removeNonAlphanumeric(v));
              })
              .join(" OR ")
          )
          .join(" OR ");
      }
      return filter.fields
        .map((field) => filter.value.map((v) => `${field}:${v}`).join(" OR "))
        .join(" OR ");
    }
    case "geom": {
      if (filter.value.geometry.type === "Polygon") {
        // LON LAT
        const value = cloneDeep(filter.value);

        // Polygon triangulation
        const data = earcut.flatten(value.geometry.coordinates);
        const triangles = earcut(data.vertices, data.holes, data.dimensions);

        // Reversing triangles to geo coordinates
        const coordinates = triangles.map((item: any) => {
          const startIndex = item * 2;
          return [data.vertices[startIndex], data.vertices[startIndex + 1]];
        });
        const triangleCoordinates = coordinates.reduce(
          (prev: any, _: any, index: number, arr: any[]) => {
            if ((index + 1) % 3 === 0) {
              prev.push([
                arr[index - 2],
                arr[index - 1],
                arr[index],
                arr[index - 2],
              ]);
            }
            return prev;
          },
          []
        );

        // Creating WKT string for query
        let wktString = geojsonToWKT({
          coordinates:
            triangleCoordinates.length > 1
              ? [triangleCoordinates]
              : triangleCoordinates,
          type: triangleCoordinates.length > 1 ? "MultiPolygon" : "Polygon",
        });
        wktString = wktString.replaceAll("), (", ")), ((");

        return filter.fields
          .map((field: string) => `${field}:"intersects(${wktString})"`)
          .join(" OR ");
      }
      return undefined;
    }
  }
}

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

    const filters = ref({
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
    } satisfies { [K: string]: FilterUnion });

    const solrFilters = computed(() => {
      return Object.entries<FilterUnion>(filters.value)
        .filter(([_key, value]) => isValidFilter(value))
        .reduce((acc, [_key, filter]) => {
          const filterStr = getSolrFilter(filter);
          if (!filterStr) {
            return acc;
          }
          if (filter.tag) {
            acc.push({ [`#${filter.tag}`]: filterStr });
          } else {
            acc.push(filterStr);
          }
          return acc;
        }, [] as (string | { [K: string]: string })[]);
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
      routeQuerySchemaFilters
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
  }
);
