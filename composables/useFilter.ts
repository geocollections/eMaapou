import cloneDeep from "lodash/cloneDeep";
import { geojsonToWKT } from "@terraformer/wkt";
import earcut from "earcut";
import isNil from "lodash/isNil";
import type { Position } from "geojson";

export function useFilter() {
  return {};
}

export type LookupType = "contains" | "exact" | "startswith" | "endswith";
export type FilterType =
  | "text"
  | "idList"
  | "textList"
  | "geom"
  | "multiHierarchyList"
  | "boolean"
  | "range"
  | "rangeAlt"
  | "parameter"
  | "dateList";

export interface BaseFilter {
  type: FilterType;
  value: any;
  fields: string[];
  tag?: string;
}

export type TextFilter = Omit<BaseFilter, "value"> & {
  type: "text";
  lookup?: LookupType;
  value: string;
};
export type BooleanFilter = Omit<BaseFilter, "value"> & {
  type: "boolean";
  value: boolean;
};

export type TextListFilter = Omit<BaseFilter, "value"> & {
  type: "textList";
  lookup?: LookupType;
  value: string[];
};

export type IdListFilter = Omit<BaseFilter, "value"> & {
  type: "idList";
  value: string[];
};

export type StringIdListFilter = Omit<BaseFilter, "value"> & {
  type: "idList";
  value: string[];
  alphaNumeric: boolean;
  lookup?: LookupType;
};
export type MultiHierarchyListFilter = Omit<BaseFilter, "value"> & {
  type: "multiHierarchyList";
  value: string[];
  idField: string;
};

export type GeomFilter = Omit<BaseFilter, "value"> & {
  type: "geom";
  value: null | GeoJSON.Feature;
};
export type RangeFilter = Omit<BaseFilter, "value"> & {
  type: "range";
  value: [null | number, null | number];
};
export type RangeAltFilter = Omit<BaseFilter, "value"> & {
  type: "rangeAlt";
  value: [null | number, null | number];
};
export type DateListFilter = Omit<BaseFilter, "value"> & {
  type: "dateList";
  value: string[][];
};

export interface ParameterValue {
  value: [null | number, null | number];
  parameter: null | string;
}

export type ParameterFilter = Omit<BaseFilter, "value" | "fields"> & {
  type: "parameter";
  value: ParameterValue[];
};

export type FilterUnion =
  | TextFilter
  | TextListFilter
  | IdListFilter
  | StringIdListFilter
  | MultiHierarchyListFilter
  | GeomFilter
  | RangeFilter
  | BooleanFilter
  | RangeAltFilter
  | DateListFilter
  | ParameterFilter;

export function useFilters<T extends { [K: string]: FilterUnion }>(initFilters: T) {
  const filters = ref<T>(cloneDeep(initFilters));
  const solrFilters = computed(() => {
    return Object.entries<FilterUnion>(filters.value)
      .filter(([_key, value]) => isValidFilter(value))
      .reduce(
        (acc, [_key, filter]) => {
          const filterStr = getSolrFilter(filter);
          if (!filterStr)
            return acc;

          if (filter.tag)
            acc.push({ [`#${filter.tag}`]: filterStr });
          else
            acc.push(filterStr);

          return acc;
        },
        [] as (string | { [K: string]: string })[],
      );
  });

  function reset() {
    // @ts-expect-error - Do not know why this is a error
    filters.value = cloneDeep(initFilters);
  }

  return {
    filters,
    solrFilters,
    reset,
  };
}

function getLookupFn(
  lookup: LookupType | undefined,
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
  return x.every(i => typeof i === "string");
}

function isStringIdListFilter(
  filter: FilterUnion,
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
    case "dateList":
      return filter.value.length > 0;
    case "multiHierarchyList":
      return filter.value.length > 0;
    case "range":
      return filter.value.some(value => value !== null);
    case "rangeAlt":
      return filter.value.some(value => value !== null);
    case "geom": {
      return filter.value !== null;
    }
    case "parameter": {
      return filter.value.filter(val => val.parameter !== null).length > 0;
    }
    case "boolean":
      return filter.value;
    default:
      return false;
  }
}

function escapeSpecialChars(s: string) {
  const pattern = /([\!\*\+\-\=\<\>\&\|\(\)\[\]\{\}\^\~\?\:\\\/"])/g;
  return s.replace(pattern, "\\$1");
}

function getSolrFilter(filter: FilterUnion) {
  switch (filter.type) {
    case "text": {
      const lookupFn = getLookupFn(filter.lookup);
      return filter.fields
        .map(field => lookupFn(field, escapeSpecialChars(filter.value)))
        .join(" OR ");
    }
    case "textList": {
      const lookupFn = getLookupFn(filter.lookup);
      return filter.fields
        .map(field =>
          filter.value.map((v) => {
            return lookupFn(field, escapeSpecialChars(v).replaceAll(" ", "\\ "));
          }).join(" OR "),
        )
        .join(" OR ");
    }
    case "boolean": {
      return filter.fields
        .map(field => `${field}:${filter.value}`)
        .join(" OR ");
    }
    case "range": {
      const start = isNil(filter.value[0]) ? "*" : filter.value[0];
      const end = isNil(filter.value[1]) ? "*" : filter.value[1];

      return filter.fields
        .map((field: string) => `${field}:[${start} TO ${end}]`)
        .join(" OR ");
    }
    case "dateList": {
      return filter.fields
        .map((field: string) => {
          return filter.value
            .map((v: string[]) => {
              if (v.length > 1)
                return `(${field}:[${v[0]}T00\\:00\\:00Z TO ${v[1]}T23\\:59\\:59Z])`;

              return `(${field}:[${v[0]}T00\\:00\\:00Z TO ${v[0]}T23\\:59\\:59Z])`;
            })
            .join(" OR ");
        })
        .join(" OR ");
    }
    case "rangeAlt": {
      return filter.value
        .filter(value => value !== null)
        .map((value) => {
          return `(${filter.fields[0]}: [${value} TO *] AND ${filter.fields[1]}: [* TO ${value}])`;
        })
        .join(" OR ");
    }
    case "idList": {
      if (isStringIdListFilter(filter)) {
        const lookupFn = getLookupFn(filter.lookup);
        return filter.fields
          .map(field =>
            filter.value
              .map((v) => {
                return lookupFn(
                  field,
                  filter.alphaNumeric ? removeNonAlphanumeric(v) : v,
                );
              })
              .join(" OR "),
          )
          .join(" OR ");
      }
      return filter.fields
        .map(field => filter.value.map(v => `${field}:${v}`).join(" OR "))
        .join(" OR ");
    }
    case "multiHierarchyList": {
      return filter.value
        .map((v) => {
          return `${filter.idField}:${v} OR ${filter.fields.map(field => `${field}:*-${v}-*`).join(" OR ")}`;
        })
        .join(" OR ");
    }
    case "parameter": {
      return filter.value.filter(val => val.parameter !== null).map((val) => {
        const start = isNil(val.value[0]) ? "*" : val.value[0];
        const end = isNil(val.value[1]) ? "*" : val.value[1];
        return `${val.parameter}:[${start} TO ${end}]`;
      }).join(" AND ");
    }
    case "geom": {
      if (filter.value?.geometry.type === "Polygon") {
        // LON LAT
        const value = cloneDeep(filter.value);

        // Polygon triangulation
        if (value.geometry.type === "Polygon") {
          const data = earcut.flatten(value.geometry.coordinates);
          const triangles = earcut(data.vertices, data.holes, data.dimensions);

          // Reversing triangles to geo coordinates
          const coordinates = triangles.map((item: any) => {
            const startIndex = item * 2;
            return [data.vertices[startIndex], data.vertices[startIndex + 1]] as Position;
          });
          const triangleCoordinates = coordinates.reduce(
            (prev, _: any, index: number, arr) => {
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
            [] as Position[][],
          );

          // Creating WKT string for query
          let wktString = geojsonToWKT({
            coordinates:
              [triangleCoordinates],
            type: "MultiPolygon",
          });
          wktString = wktString.replaceAll("), (", ")), ((");

          return filter.fields
            .map((field: string) => `${field}:"intersects(${wktString})"`)
            .join(" OR ");
        }
      }
      return undefined;
    }
  }
}
