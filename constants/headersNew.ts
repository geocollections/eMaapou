import type { VDataTable } from "vuetify/components";

interface SortItem { key: string; order: "asc" | "desc" }
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
export interface Headers {
  byIds: { [K: string]: Header };
  allIds: string[];
}

const numberFieldProps: Partial<Header> = {
  align: "end",
  cellProps(data) {
    return {
      style: "font-family: monospace;",
    };
  },
};

export const HEADERS_ANALYSIS: Headers = {
  byIds: {
    id: {
      title: "analysis.id",
      value: "id",
      show: true,
      apiFieldValue: "id_l",
      sortField: ["id_l"],
    },
    sample_name: {
      title: "analysis.sampleNumber",
      value: "sample_name",
      show: true,
      apiFieldValue: "sample_number",
      sortField: ["sample_name"],
    },
    locality: {
      title: "analysis.locality",
      value: "locality",
      show: true,
      apiFieldValue: { et: "locality", en: "locality_en" },
      sortField: { et: ["locality"], en: ["locality_en"] },
    },
    depth: {
      title: "analysis.depth",
      value: "depth",
      show: true,
      apiFieldValue: "depth",
      sortField: ["depth"],
    },
    depth_interval: {
      title: "analysis.depthInterval",
      value: "depth_interval",
      show: true,
      apiFieldValue: "depth_interval",
      sortField: ["depth_interval"],
    },
    method: {
      title: "analysis.method",
      value: "method",
      show: true,
      apiFieldValue: { et: "analysis_method", en: "analysis_method_en" },
      sortField: { et: ["analysis_method"], en: ["analysis_method_en"] },
    },
    method_details: {
      title: "analysis.methodDetails",
      value: "method_details",
      show: true,
      apiFieldValue: { et: "method_details", en: "method_details_en" },
      sortField: { et: ["method_details"], en: ["method_details_en"] },
    },
    agent: {
      title: "analysis.analysedBy",
      value: "agent",
      show: true,
      apiFieldValue: "agent",
      sortField: ["agent"],
    },
    date: {
      title: "analysis.date",
      value: "date",
      show: true,
      apiFieldValue: "date",
      sortField: ["date"],
    },
  },
  allIds: [
    "id",
    "sample_name",
    "locality",
    "depth",
    "depth_interval",
    "method",
    "method_details",
    "agent",
    "date",
  ],
};

export const HEADERS_ANALYTICAL_DATA: Headers = {
  byIds: {
    analysis_id: {
      title: "analyticalData.analysis",
      value: "analysis_id",
      show: true,
      apiFieldValue: "analysis_id_sl",
      sortField: ["analysis_id_sl"],
    },
    analysis_method: {
      title: "analyticalData.analysisMethod",
      value: "analysis_method",
      show: true,
      apiFieldValue: { et: "analysis_method", en: "analysis_method_en" },
      sortField: { et: ["analysis_method"], en: ["analysis_method_en"] },
    },
    sample_number: {
      title: "analyticalData.sample",
      value: "sample_number",
      show: true,
      apiFieldValue: "sample_number,sample_id_sl",
      sortField: ["sample_number", "sample_id_sl"], // TODO: need to combine these two fields in Solr index
    },
    locality: {
      title: "analyticalData.locality",
      value: "locality",
      show: true,
      apiFieldValue: "locality,locality_id_sl,site,site_id_sl",
      sortField: ["locality", "site"], // TODO: need to combine these two fields in Solr index, not sure how it should be done. Can one document have both fields defined?
    },
    stratigraphy: {
      title: "analyticalData.stratigraphy",
      value: "stratigraphy",
      show: true,
      apiFieldValue: {
        et: "stratigraphy,stratigraphy_id_sl",
        en: "stratigraphy_en,stratigraphy_id_sl",
      },
      sortField: {
        et: ["stratigraphy"],
        en: ["stratigraphy_en"],
      },
    },
    lithostratigraphy: {
      title: "analyticalData.lithostratigraphy",
      value: "lithostratigraphy",
      show: false,
      apiFieldValue: {
        et: "lithostratigraphy,lithostratigraphy_id_sl",
        en: "lithostratigraphy_en,lithostratigraphy_id_sl",
      },
      sortField: {
        et: ["lithostratigraphy"],
        en: ["lithostratigraphy_en"],
      },
    },
    depth: {
      title: "analyticalData.depth",
      value: "depth",
      show: true,
      apiFieldValue: "depth,depth_interval",
      sortField: ["depth", "depth_interval"],
    },
    rock: {
      title: "analyticalData.rock",
      value: "rock",
      show: true,
      apiFieldValue: {
        et: "rock,rock_txt,rock_id_sl",
        en: "rock_en,rock_en_txt,rock_id_sl",
      },
      sortField: {
        et: ["rock", "rock_txt"],
        en: ["rock_en", "rock_en_txt"],
      },
    },
    reference: {
      title: "analyticalData.reference",
      value: "reference",
      show: true,
      apiFieldValue: "reference,reference_id_sl",
      sortField: ["reference"],
    },
    dataset_id: {
      title: "analyticalData.dataset",
      value: "dataset_id",
      show: true,
      apiFieldValue: "dataset_id_sl,dataset_name",
      sortField: ["dataset_name"],
    },
  },
  allIds: [
    "analysis_id",
    "analysis_method",
    "sample_number",
    "locality",
    "stratigraphy",
    "lithostratigraphy",
    "depth",
    "rock",
    "reference",
    "dataset_id",
  ],
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

export const HEADERS_DATASET: Headers = {
  byIds: {
    id: {
      title: "dataset.id",
      value: "id",
      show: false,
      apiFieldValue: "dataset_id",
      sortField: ["dataset_id"],
    },
    name: {
      title: "dataset.name",
      value: "name",
      show: true,
      apiFieldValue: { et: "name", en: "name_en" },
      sortField: { et: ["name"], en: ["name_en"] },
    },
    date: {
      title: "dataset.date",
      value: "date",
      show: true,
      apiFieldValue: "date,date_txt",
      sortField: ["date", "date_txt"],
    },
    database: {
      title: "dataset.database",
      value: "database_acronym",
      show: true,
      apiFieldValue: "database_acronym",
      sortField: ["database_acronym"],
    },
  },
  allIds: ["id", "name", "date", "database"],
};

export const HEADERS_DRILLCORE: Headers = {
  byIds: {
    id: {
      title: "drillcore.id",
      value: "id",
      show: false,
      apiFieldValue: "id_l",
      sortField: ["id_l"],
    },
    drillcore: {
      title: "drillcore.name",
      value: "drillcore",
      show: true,
      apiFieldValue: { et: "drillcore", en: "drillcore_en" },
      sortField: { et: ["drillcore"], en: ["drillcore_en"] },
    },
    depth: {
      title: "drillcore.depth",
      value: "depth",
      show: true,
      apiFieldValue: "depth",
      sortField: ["depth"],
    },
    boxes: {
      title: "drillcore.boxes",
      value: "boxes",
      show: true,
      apiFieldValue: "boxes",
      sortField: ["boxes"],
      ...numberFieldProps,
    },
    box_numbers: {
      title: "drillcore.boxNumbers",
      value: "box_numbers",
      show: true,
      apiFieldValue: "box_numbers",
      sortField: ["box_numbers"],
      ...numberFieldProps,
    },
    year: {
      title: "drillcore.year",
      value: "year",
      show: true,
      apiFieldValue: "year",
      sortField: ["year"],
    },
    core_repository: {
      title: "drillcore.storage",
      value: "core_repository",
      show: true,
      apiFieldValue: { et: "core_repository", en: "core_repository_en" },
      sortField: { et: ["core_repository"], en: ["core_repository_en"] },
    },
    acronym: {
      title: "drillcore.acronym",
      value: "acronym",
      show: true,
      apiFieldValue: "acronym",
      sortField: ["acronym"],
    },
  },
  allIds: [
    "id",
    "drillcore",
    "depth",
    "boxes",
    "box_numbers",
    "year",
    "core_repository",
    "acronym",
  ],
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

export const HEADERS_PREPARATION: Headers = {
  byIds: {
    id: {
      title: "preparation.id",
      value: "id",
      show: false,
      apiFieldValue: "id_l",
      sortField: ["id_l"],
    },
    preparation_number: {
      title: "preparation.preparation_number",
      value: "preparation_number",
      show: true,
      apiFieldValue: "preparation_number",
      sortField: ["preparation_number"],
    },
    locality: {
      title: "preparation.locality",
      value: "locality",
      show: true,
      apiFieldValue: { et: "locality", en: "locality_en" },
      sortField: { et: ["locality"], en: ["locality_en"] },
    },
    depth: {
      title: "preparation.depth",
      value: "depth",
      show: true,
      apiFieldValue: "depth,depth_interval",
      sortField: ["depth", "depth_interval"],
    },
    stratigraphy: {
      title: "preparation.stratigraphy",
      value: "stratigraphy",
      show: true,
      apiFieldValue: {
        et: "stratigraphy,lithostratigraphy",
        en: "stratigraphy_en,lithostratigraphy_en",
      },
      sortField: {
        et: ["stratigraphy", "lithostratigraphy"],
        en: ["stratigraphy_en", "lithostratigraphy_en"],
      },
    },
    agent: {
      title: "preparation.agent",
      value: "agent",
      show: true,
      apiFieldValue: "agent",
      sortField: ["agent"],
    },
    mass: {
      title: "preparation.mass",
      value: "mass",
      show: true,
      apiFieldValue: "mass",
      sortField: ["mass"],
    },
  },
  allIds: [
    "id",
    "preparation_number",
    "locality",
    "depth",
    "stratigraphy",
    "agent",
    "mass",
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
