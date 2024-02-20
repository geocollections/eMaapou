import type { VDataTable } from "vuetify/components";

type SortItem = { key: string; order: "asc" | "desc" };
type SortField = SortItem | { et: SortItem; en: SortItem };

export type Header = NonNullable<
  InstanceType<typeof VDataTable>["headers"]
>[0] & {
  show: boolean;
  apiFieldValue?: string | { et: string; en: string };
  sortField?: string[] | { et: string[]; en: string[] };
  // | {
  //     asc: SortField[];
  //     desc: SortField[];
  //   };
  titleTranslate?: boolean;
};
export type Headers = {
  byIds: { [K: string]: Header };
  allIds: string[];
};

const numberFieldProps: Partial<Header> = {
  align: "end",
  cellProps(data) {
    return {
      style: "font-family: monospace;",
    };
  },
};

export const HEADERS_AREA: Headers = {
  byIds: {
    id: {
      title: "area.id",
      value: "id",
      show: false,
      apiFieldValue: "id",
      sortField: ["id"],
    },
    name: {
      title: "area.name",
      value: "name",
      show: true,
      apiFieldValue: { et: "name", en: "name_en" },
      sortField: { et: ["name"], en: ["name_en"] },
    },
    county: {
      title: "area.county",
      value: "county",
      show: true,
      apiFieldValue: { et: "maakond", en: "maakond_en" },
      sortField: { et: ["maakond"], en: ["maakond_en"] },
    },
    type: {
      title: "area.areaType",
      value: "type",
      show: true,
      apiFieldValue: { et: "area_type", en: "area_type_en" },
      sortField: { et: ["area_type"], en: ["area_type_en"] },
    },
    size: {
      title: "area.areaHa",
      value: "size",
      show: true,
      apiFieldValue: "area_ha",
      sortField: ["area_ha"],
      ...numberFieldProps,
    },
  },
  allIds: ["id", "name", "county", "type", "size"],
};

export const HEADERS_LOCALITY: Headers = {
  byIds: {
    id: {
      title: "locality.id",
      value: "id",
      show: false,
      apiFieldValue: "id_l",
      sortField: ["id_l"],
    },
    locality: {
      title: "locality.name",
      value: "locality",
      show: true,
      apiFieldValue: { et: "locality", en: "locality_en" },
      sortField: { et: ["locality"], en: ["locality_en"] },
    },
    country: {
      title: "locality.country",
      value: "country",
      show: true,
      apiFieldValue: { et: "country", en: "country_en" },
      sortField: { et: ["country"], en: ["country_en"] },
    },
    coordinates: {
      title: "locality.coordinates",
      value: "coordinates",
      show: true,
      sortable: false,
      align: "end",
      children: [
        {
          title: "locality.latitude",
          value: "latitude",
          width: 75,
          apiFieldValue: "latitude",
          ...numberFieldProps,
        },
        {
          title: "locality.longitude",
          value: "longitude",
          width: 75,
          apiFieldValue: "longitude",
          ...numberFieldProps,
        },
      ],
    },
    references: {
      title: "locality.relatedReferences",
      value: "references",
      show: true,
      sortable: false,
      apiFieldValue: "related_references",
      sortField: ["related_references"],
      ...numberFieldProps,
    },
    specimens: {
      title: "locality.relatedSpecimens",
      value: "specimens",
      show: true,
      apiFieldValue: "related_specimens",
      sortField: ["related_specimens"],
      ...numberFieldProps,
    },
    samples: {
      title: "locality.relatedSamples",
      value: "samples",
      show: true,
      apiFieldValue: "related_samples",
      sortField: ["related_samples"],
      ...numberFieldProps,
    },
    analyses: {
      title: "locality.relatedAnalyses",
      value: "analyses",
      show: true,
      apiFieldValue: "related_analyses",
      sortField: ["related_analyses"],
      ...numberFieldProps,
    },
    drillcores: {
      title: "locality.relatedDrillcores",
      value: "drillcores",
      show: false,
      apiFieldValue: "related_drillcores",
      sortField: ["related_drillcores"],
      ...numberFieldProps,
    },
    files: {
      title: "locality.relatedFiles",
      value: "files",
      show: false,
      apiFieldValue: "related_files",
      sortField: ["related_files"],
      ...numberFieldProps,
    },
    images: {
      title: "locality.relatedImages",
      value: "images",
      show: false,
      apiFieldValue: "related_images",
      sortField: ["related_images"],
      ...numberFieldProps,
    },
    stratotypes: {
      title: "locality.relatedStratotypes",
      value: "stratotypes",
      show: false,
      apiFieldValue: "related_stratotypes",
      sortField: ["related_stratotypes"],
      ...numberFieldProps,
    },
    taxonOccurrences: {
      title: "locality.relatedTaxonOccurrences",
      value: "taxonOccurrences",
      show: false,
      apiFieldValue: "related_taxon_occurrences",
      sortField: ["related_taxon_occurrences"],
      ...numberFieldProps,
    },
  },
  allIds: [
    "id",
    "locality",
    "country",
    "coordinates",
    // "latitude",
    // "longitude",
    "references",
    "specimens",
    "samples",
    "analyses",
    "drillcores",
    "files",
    "images",
    "stratotypes",
    "taxonOccurrences",
  ],
};

export const HEADERS_SAMPLE: Headers = {
  byIds: {
    id: {
      title: "sample.id",
      value: "id",
      show: true,
      apiFieldValue: "id_l",
    },
    number: {
      title: "sample.number",
      value: "number",
      show: true,
      apiFieldValue: "number",
    },
    locality: {
      title: "sample.locality",
      value: "locality",
      show: true,
      apiFieldValue: {
        et: "locality,site_name",
        en: "locality_en,site_name_en",
      },
      sortField: {
        et: ["locality", "site_name"],
        en: ["locality_en", "site_name_en"],
      },
    },
    depth: {
      title: "sample.depth",
      value: "depth",
      show: true,
      apiFieldValue: "depth",
      sortField: ["depth", "depth_interval"],
    },
    stratigraphy: {
      title: "sample.stratigraphy",
      value: "stratigraphy",
      show: true,
      apiFieldValue: { et: "stratigraphy", en: "stratigraphy_en" },
      sortField: { et: ["stratigraphy"], en: ["stratigraphy_en"] },
    },
    lithostratigraphy: {
      title: "sample.lithostratigraphy",
      value: "lithostratigraphy",
      show: false,
      apiFieldValue: { et: "lithostratigraphy", en: "lithostratigraphy_en" },
      sortField: { et: ["lithostratigraphy"], en: ["lithostratigraphy_en"] },
    },
    collector: {
      title: "sample.collector",
      value: "collector",
      show: true,
      apiFieldValue: "collector",
    },
    dateCollected: {
      title: "sample.dateCollected",
      value: "date_collected",
      show: true,
      apiFieldValue: "date_collected",
    },
    image: {
      title: "sample.image",
      value: "image",
      show: true,
      apiFieldValue: "image",
      sortable: false,
    },
  },
  allIds: [
    "id",
    "number",
    "locality",
    "depth",
    "stratigraphy",
    "lithostratigraphy",
    "collector",
    "dateCollected",
    "image",
  ],
};

export const HEADERS_SITE: Headers = {
  byIds: {
    id: {
      title: "site.id",
      value: "id",
      show: false,
      apiFieldValue: "id_l",
      sortField: ["id_l"],
    },
    name: {
      title: "site.name",
      value: "name",
      show: true,
      apiFieldValue: { et: "name", en: "name_en" },
      sortField: ["name"],
    },
    area: {
      title: "site.area",
      value: "area",
      show: true,
      apiFieldValue: { et: "area_name", en: "area_name_en" },
      sortField: { et: ["area_name"], en: ["area_name_en"] },
    },
    coordinates: {
      title: "locality.coordinates",
      value: "coordinates",
      show: true,
      sortable: false,
      align: "end",
      children: [
        {
          title: "locality.latitude",
          value: "latitude",
          width: 75,
          apiFieldValue: "latitude",
          ...numberFieldProps,
        },
        {
          title: "locality.longitude",
          value: "longitude",
          width: 75,
          apiFieldValue: "longitude",
          ...numberFieldProps,
        },
      ],
    },
    elevation: {
      title: "site.elevation",
      value: "elevation",
      show: true,
      apiFieldValue: "z",
      sortField: ["z"],
      ...numberFieldProps,
    },
    depth: {
      title: "site.depth",
      value: "depth",
      show: true,
      apiFieldValue: "depth",
      sortField: ["depth"],
      ...numberFieldProps,
    },
  },
  allIds: ["id", "name", "area", "coordinates", "elevation", "depth"],
};
