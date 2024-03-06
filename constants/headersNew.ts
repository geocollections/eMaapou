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

export const HEADERS_ANALYSIS_RESULT: Headers = {
  byIds: {
    parameter: {
      title: "analysisResult.parameter",
      value: "parameter",
      show: true,
      apiFieldValue: "parameter",
      sortField: ["parameter"],
    },
    analysis_method: {
      title: "analysisResult.method",
      value: "analysis_method",
      show: true,
      apiFieldValue: "analysis_method",
      sortField: ["analysis_method"],
    },
    depth: {
      title: "analysisResult.depth",
      value: "depth",
      show: true,
      apiFieldValue: "depth",
      sortField: ["depth"],
    },
    depth_interval: {
      title: "analysisResult.depthInterval",
      value: "depth_interval",
      show: true,
      apiFieldValue: "depth_interval",
      sortField: ["depth_interval"],
    },
    value: {
      title: "analysisResult.value",
      value: "value",
      show: true,
      sortField: ["value"],
    },
    value_txt: {
      title: "analysisResult.valueText",
      value: "value_txt",
      show: true,
      apiFieldValue: "value_txt",
      sortField: ["value_txt"],
    },
    value_error: {
      title: "analysisResult.valueError",
      value: "value_error",
      show: true,
      apiFieldValue: "value_error",
      sortField: ["value_error"],
    },
  },
  allIds: [
    "parameter",
    "analysis_method",
    "depth",
    "depth_interval",
    "value",
    "value_txt",
    "value_error",
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

export const HEADERS_AREA_LOCALITY: Headers = {
  byIds: {
    id: {
      title: "locality.id",
      value: "id",
      show: false,
      apiFieldValue: "id",
      sortField: ["id"],
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
      sortField: { et: ["country__value"], en: ["country__value_en"] },
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
  },
  allIds: [
    "id",
    "locality",
    "country",
    "coordinates",
  ],
};

export const HEADERS_ATTACHMENT: Headers = {
  byIds: {
    file: {
      title: "attachment.file",
      value: "file",
      width: "120px",
      show: true,
      sortable: false,
    },
    description: {
      title: "attachment.description",
      value: "description",
      show: true,
      apiFieldValue: {
        et: "attachment__description",
        en: "attachment__description_en",
      },
      sortField: {
        et: ["attachment__description"],
        en: ["attachment__description_en"],
      },
    },
    agent: {
      title: "attachment.author",
      value: "agent",
      show: true,
      apiFieldValue: "attachment__author__agent",
      sortField: ["attachment__author__agent"],
    },
  },
  allIds: ["file", "description", "agent"],
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

export const HEADERS_DATASET_ANALYSIS: Headers = {
  byIds: {
    analysis: {
      title: "datasetAnalysis.analysis",
      value: "analysis",
      show: true,
      apiFieldValue: "id_l",
      sortField: ["id_l"],
    },
    sample: {
      title: "datasetAnalysis.sampleNumber",
      value: "sample",
      show: true,
      apiFieldValue: "sample_id_sl",
      sortField: ["sample_id"],
    },
    locality: {
      title: "datasetAnalysis.locality",
      value: "locality",
      show: true,
      apiFieldValue: "locality",
      sortField: ["locality"],
    },
    stratigraphy: {
      title: "datasetAnalysis.stratigraphy",
      value: "stratigraphy",
      show: true,
      apiFieldValue: { et: "stratigraphy", en: "stratigraphy_en" },
      sortField: { et: ["stratigraphy"], en: ["stratigraphy_en"] },
    },
    analysis_method: {
      title: "datasetAnalysis.analysisMethod",
      value: "analysis_method",
      show: true,
      apiFieldValue: { et: "analysis_method", en: "analysis_method_en" },
      sortField: { et: ["analysis_method"], en: ["analysis_method_en"] },
    },
    lab: {
      title: "datasetAnalysis.lab",
      value: "lab",
      show: true,
      apiFieldValue: { et: "lab", en: "lab_en" },
      sortField: { et: ["lab"], en: ["lab_en"] },
    },
  },
  allIds: [
    "analysis",
    "sample",
    "locality",
    "stratigraphy",
    "analysis_method",
    "lab",
  ],
};

export const HEADERS_DATASET_AUTHOR: Headers = {
  byIds: {
    name: {
      title: "datasetAuthor.name",
      value: "name",
      show: true,
      apiFieldValue: "agent__agent",
      sortField: ["agent__agent"],
    },
    affiliation: {
      title: "datasetAuthor.affiliation",
      value: "affiliation",
      show: true,
      apiFieldValue: "affiliation",
      sortField: ["affiliation"],
    },
    type: {
      title: "datasetAuthor.type",
      value: "type",
      show: true,
      apiFieldValue: "agent_type__value",
      sortField: ["agent_type__value"],
    },
  },
  allIds: ["name", "affiliation", "type"],
};

export const HEADERS_DATASET_GEOLOCATION: Headers = {
  byIds: {
    name: {
      title: "datasetGeolocation.name",
      value: "name",
      show: true,
      apiFieldValue: { et: "locality__locality", en: "locality__locality_en" },
      sortField: { et: ["locality__locality"], en: ["locality__locality_en"] },
    },
    longitude: {
      title: "datasetGeolocation.longitude",
      value: "longitude",
      show: true,
      apiFieldValue: "point_latitude",
      sortField: ["point_latitude"],
    },
    latitude: {
      title: "datasetGeolocation.latitude",
      value: "latitude",
      show: true,
      apiFieldValue: "point_longitude",
      sortField: ["point_longitude"],
    },
    is_polygon: {
      title: "datasetGeolocation.isPolygon",
      value: "is_polygon",
      sortable: false,
      show: true,
      sortField: ["is_polygon"],
    },
  },
  allIds: ["name", "longitude", "latitude", "is_polygon"],
};

export const HEADERS_DATASET_REFERENCE: Headers = {
  byIds: {
    reference: {
      title: "reference.reference",
      value: "reference",
      show: true,
      apiFieldValue: "reference__reference",
      sortField: ["reference__reference"],
    },
    title: {
      title: "reference.title",
      value: "title",
      show: true,
      apiFieldValue: "reference__title",
      sortField: ["reference__title"],
    },
    journal: {
      title: "reference.journalBook",
      value: "journal",
      show: true,
      apiFieldValue: "reference__pages",
      sortField: ["reference__pages"],
    },
    pages: {
      title: "reference.pages",
      value: "pages",
      show: true,
      apiFieldValue: "reference__journal__journal_name",
      sortField: ["reference__journal__journal_name"],
    },
  },
  allIds: ["reference", "title", "journal", "pages"],
};

export const HEADERS_DESCRIPTION: Headers = {
  byIds: {
    depth_top: {
      title: "localityDescription.depthTop",
      value: "depth_top",
      show: true,
      apiFieldValue: "depth_top",
      sortField: ["depth_top"],
      ...numberFieldProps,
    },
    depth_base: {
      title: "localityDescription.depthBase",
      value: "depth_base",
      show: true,
      apiFieldValue: "depth_base",
      sortField: ["depth_base"],
      ...numberFieldProps,
    },
    thickness: {
      title: "localityDescription.thickness",
      value: "thickness",
      class: "static-cell-header",
      sortable: false,
      cellClass: "static-cell",
      show: true,
      ...numberFieldProps,
    },
    rock: {
      title: "localityDescription.rock",
      value: "rock",
      show: true,
      apiFieldValue: { et: "rock__name", en: "rock__name_en" },
      sortField: { et: ["rock__name"], en: ["rock__name_en"] },
    },
    stratigraphy: {
      title: "localityDescription.stratigraphy",
      value: "stratigraphy",
      show: true,
      apiFieldValue: {
        et: "stratigraphy__stratigraphy",
        en: "stratigraphy__stratigraphy_en",
      },
      sortField: {
        et: ["stratigraphy__stratigraphy"],
        en: ["stratigraphy__stratigraphy_en"],
      },
    },
    author: {
      title: "localityDescription.author",
      value: "author",
      sortable: false,
      show: true,
      apiFieldValue: "reference__reference,agent__agent,author_free",
      sortField: ["reference__reference", "agent__agent", "author_free"],
    },
    expand: {
      title: "localityDescription.details",
      value: "data-table-expand",
      align: "center",
      sortable: false,
      show: true,
    },
  },
  allIds: [
    "depth_top",
    "depth_base",
    "thickness",
    "rock",
    "stratigraphy",
    "author",
    "expand",
  ],
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

export const HEADERS_FOSSIL: Headers = {
  byIds: {
    taxon: {
      title: "taxon.taxon",
      value: "taxon",
      show: true,
      apiFieldValue: "taxon",
      sortField: ["taxon"],
    },
    fossil_group: {
      title: "taxon.fossilGroup",
      value: "fossil_group",
      show: true,
      apiFieldValue: "fossil_group",
      sortField: ["fossil_group"],
    },
    parent: {
      title: "taxon.parentTaxon",
      value: "parent",
      show: true,
      apiFieldValue: "parent_taxon",
      sortField: ["parent_taxon"],
    },
    src: {
      title: "taxon.src",
      value: "src",
      show: true,
      apiFieldValue: { et: "src_txt", en: "src_txt_en" },
      sortField: { et: ["src_txt"], en: ["src_txt_en"] },
    },
  },
  allIds: ["fossil_group", "taxon", "parent", "src"],
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

export const HEADERS_LOCALITY_REFERENCE: Headers = {
  byIds: {
    reference: {
      title: "localityReference.reference",
      value: "reference",
      show: true,
      apiFieldValue: "reference__reference",
      sortField: ["reference__reference"],
    },
    title: {
      title: "localityReference.referenceTitle",
      value: "title",
      show: true,
      apiFieldValue: "reference__title",
      sortField: ["reference__title"],
    },
    pages: {
      title: "localityReference.pages",
      value: "pages",
      show: true,
      apiFieldValue: "pages",
      sortField: ["pages"],
    },
    remarks: {
      title: "localityReference.remarks",
      value: "remarks",
      show: true,
      apiFieldValue: "remarks",
      sortField: ["remarks"],
    },
  },
  allIds: ["reference", "title", "pages", "remarks"],
};

export const HEADERS_LOCALITY_SYNONYM: Headers = {
  byIds: {
    synonym: {
      title: "localitySynonym.synonym",
      value: "synonym",
      show: true,
      apiFieldValue: "synonym",
      sortField: ["synonym"],
    },
    pages: {
      title: "localitySynonym.pages",
      value: "pages",
      show: true,
      apiFieldValue: "pages",
      sortField: ["pages"],
    },
    reference: {
      title: "localitySynonym.reference",
      value: "reference",
      show: true,
      apiFieldValue: "reference__reference",
      sortField: ["reference__reference"],
    },
    remarks: {
      title: "localitySynonym.remarks",
      value: "remarks",
      show: true,
      apiFieldValue: "remarks",
      sortField: ["remarks"],
    },
  },
  allIds: ["synonym", "pages", "reference", "remarks"],
};

export const HEADERS_LOCALITY_STRATOTYPE: Headers = {
  byIds: {
    stratigraphy: {
      title: "stratotype.stratigraphy",
      value: "stratigraphy",
      show: true,
      apiFieldValue: {
        et: "stratigraphy__stratigraphy",
        en: "stratigraphy__stratigraphy_en",
      },
      sortField: {
        et: ["stratigraphy__stratigraphy"],
        en: ["stratigraphy__stratigraphy_en"],
      },
    },
    type: {
      title: "stratotype.type",
      value: "type",
      show: true,
      apiFieldValue: {
        et: "stratotype_type__value",
        en: "stratotype_type__value_en",
      },
      sortField: {
        et: ["stratotype_type__value"],
        en: ["stratotype_type__value_en"],
      },
    },
    depth_top: {
      title: "stratotype.depthTop",
      value: "depth_top",
      show: true,
      apiFieldValue: "depth_top",
      sortField: ["depth_top"],
    },
    depth_base: {
      title: "stratotype.depthBase",
      value: "depth_base",
      show: true,
      apiFieldValue: "depth_base",
      sortField: ["depth_base"],
    },
    reference: {
      title: "stratotype.reference",
      value: "reference",
      show: true,
      apiFieldValue: "reference__reference",
      sortField: ["reference__reference"],
    },
    remarks: {
      title: "stratotype.remarks",
      value: "remarks",
      show: true,
      apiFieldValue: "remarks",
      sortField: ["remarks"],
    },
  },
  allIds: [
    "stratigraphy",
    "type",
    "depth_top",
    "depth_base",
    "reference",
    "remarks",
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

export const HEADERS_SAMPLE_DATA: Headers = {
  byIds: {
    sample: {
      title: "sampleData.sampleNumber",
      value: "sample",
      show: true,
      apiFieldValue: "sample_number",
      sortField: ["sample_number"],
    },
    latitude: {
      title: "sampleData.latitude",
      value: "latitude",
      show: false,
      apiFieldValue: "latitude",
      sortField: ["latitude"],
    },
    longitude: {
      title: "sampleData.longitude",
      value: "longitude",
      show: false,
      apiFieldValue: "longitude",
      sortField: ["longitude"],
    },
    locality: {
      title: "datasetAnalysis.locality",
      value: "locality",
      show: true,
      apiFieldValue: "locality",
      sortField: ["locality"],
    },
    depth: {
      title: "sampleData.depth",
      value: "depth",
      show: true,
      apiFieldValue: "depth",
      sortField: ["depth"],
    },
    depth_interval: {
      title: "sampleData.depthInterval",
      value: "depth_interval",
      show: false,
      apiFieldValue: "depth_interval",
      sortField: ["depth_interval"],
    },
    stratigraphy: {
      title: "datasetAnalysis.stratigraphy",
      value: "stratigraphy",
      show: true,
      apiFieldValue: { et: "stratigraphy", en: "stratigraphy_en" },
      sortField: { et: ["stratigraphy"], en: ["stratigraphy_en"] },
    },
  },
  allIds: [
    "sample",
    "locality",
    "depth",
    "depth_interval",
    "latitude",
    "longitude",
    "stratigraphy",
  ],
};

export const HEADERS_SAMPLE_REFERENCE: Headers = {
  byIds: {
    reference: {
      title: "sampleReference.reference",
      value: "reference",
      show: true,
      apiFieldValue: "reference__reference",
      sortField: ["reference__reference"],
    },
    reference__title: {
      title: "sampleReference.referenceTitle",
      value: "reference__title",
      show: true,
      apiFieldValue: "reference__title",
      sortField: ["reference__title"],
    },
    pages: {
      title: "sampleReference.pages",
      value: "pages",
      show: true,
      apiFieldValue: "pages",
      sortField: ["pages"],
    },
    remarks: {
      title: "sampleReference.remarks",
      value: "remarks",
      show: true,
      apiFieldValue: "remarks",
      sortField: ["remarks"],
    },
  },
  allIds: ["reference", "reference__title", "pages", "remarks"],
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

export const HEADERS_SPECIMEN: Headers = {
  byIds: {
    id: {
      title: "specimen.id",
      value: "id",
      show: false,
      apiFieldValue: "id",
      sortField: ["id"],
    },
    specimen_full_name: {
      title: "specimen.number",
      value: "specimen_full_name",
      show: true,
      apiFieldValue: "specimen_full_name",
      sortField: ["specimen_full_name"],
    },
    specimen_number_old: {
      title: "specimen.oldNumber",
      value: "specimen_number_old",
      show: false,
      apiFieldValue: "specimen_number_old",
      sortField: ["specimen_number_old"],
    },
    original_status: {
      title: "specimen.originalStatus",
      value: "original_status",
      show: false,
      apiFieldValue: { et: "original_status", en: "original_status_en" },
      sortField: { et: ["original_status"], en: ["original_status_en"] },
    },
    locality: {
      title: "specimen.locality",
      value: "locality",
      show: true,
      apiFieldValue: { et: "locality", en: "locality_en" },
      sortField: { et: ["locality"], en: ["locality_en"] },
    },
    depth: {
      title: "specimen.depth",
      value: "depth",
      show: true,
      apiFieldValue: "depth",
      sortField: ["depth"],
      ...numberFieldProps,
    },
    depth_interval: {
      title: "specimen.depthInterval",
      value: "depth_interval",
      show: false,
      apiFieldValue: "depth_interval",
      sortField: ["depth_interval"],
      ...numberFieldProps,
    },
    stratigraphy: {
      title: "specimen.stratigraphy",
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
    name: {
      title: "specimen.name",
      value: "name",
      show: true,
      sortable: false,
      class: "static-cell-header",
      apiFieldValue: { et: "rock", en: "rock_en" },
      sortField: { et: ["rock"], en: ["rock_en"] },
    },
    image: {
      title: "specimen.image",
      value: "image",
      show: true,
      apiFieldValue: "image",
      sortable: false,
    },
    collector: {
      title: "specimen.collector",
      value: "collector",
      show: false,
      apiFieldValue: "collector",
      sortField: ["collector"],
    },
  },
  allIds: [
    "id",
    "specimen_full_name",
    "specimen_number_old",
    "name",
    "locality",
    "depth",
    "depth_interval",
    "stratigraphy",
    "lithostratigraphy",
    "original_status",
    "collector",
    "image",
  ],
};

export const HEADERS_STRATIGRAPHY: Headers = {
  byIds: {
    id: {
      title: "stratigraphy.id",
      value: "id",
      show: false,
      apiFieldValue: "id",
      sortField: ["id"],
    },
    stratigraphy: {
      title: "stratigraphy.stratigraphy",
      value: "stratigraphy",
      show: true,
      apiFieldValue: { et: "stratigraphy", en: "stratigraphy_en" },
      sortField: { et: ["stratigraphy"], en: ["stratigraphy_en"] },
    },
    index_main: {
      title: "stratigraphy.index_main",
      value: "index_main",
      show: true,
      apiFieldValue: "index_main",
      sortField: ["index_main"],
    },
    index_additional: {
      title: "stratigraphy.index_additional",
      value: "index_additional",
      show: true,
      apiFieldValue: "index_additional",
      sortField: ["index_additional"],
    },
    stratigraphy_type: {
      title: "stratigraphy.stratigraphy_type",
      value: "stratigraphy_type",
      show: true,
      apiFieldValue: { et: "stratigraphy_type", en: "stratigraphy_type_en" },
      sortField: { et: ["stratigraphy_type"], en: ["stratigraphy_type_en"] },
    },
    stratigraphy_rank: {
      title: "stratigraphy.stratigraphy_rank",
      value: "stratigraphy_rank",
      show: true,
      apiFieldValue: { et: "stratigraphy_rank", en: "stratigraphy_rank_en" },
      sortField: { et: ["stratigraphy_rank"], en: ["stratigraphy_rank_en"] },
    },
    stratigraphy_scope: {
      title: "stratigraphy.stratigraphy_scope",
      value: "stratigraphy_scope",
      show: true,
      apiFieldValue: { et: "stratigraphy_scope", en: "stratigraphy_scope_en" },
      sortField: { et: ["stratigraphy_scope"], en: ["stratigraphy_scope_en"] },
    },
    parent_stratigraphy: {
      title: "stratigraphy.parent_stratigraphy",
      value: "parent_stratigraphy",
      show: true,
      apiFieldValue: {
        et: "parent_stratigraphy",
        en: "parent_stratigraphy_en",
      },
      sortField: { et: ["parent_stratigraphy"], en: ["parent_stratigraphy_en"] },
    },
    ageBase: {
      title: "stratigraphy.ageBase",
      value: "ageBase",
      show: true,
      apiFieldValue: "age_base",
      sortField: ["age_base"],
    },
    ageTop: {
      title: "stratigraphy.ageTop",
      value: "ageTop",
      show: true,
      apiFieldValue: "age_top",
      sortField: ["age_top"],
    },
    age_stratigraphy: {
      title: "stratigraphy.age_stratigraphy",
      value: "age_stratigraphy",
      show: true,
      apiFieldValue: { et: "age_stratigraphy", en: "age_stratigraphy_en" },
      sortField: { et: ["age_stratigraphy"], en: ["age_stratigraphy_en"] },
    },
  },
  allIds: [
    "id",
    "stratigraphy",
    "index_main",
    "index_additional",
    "stratigraphy_type",
    "stratigraphy_rank",
    "stratigraphy_scope",
    "parent_stratigraphy",
    "ageBase",
    "ageTop",
    "age_stratigraphy",
  ],
};

export const HEADERS_STRATIGRAPHY_STRATOTYPE: Headers = {
  byIds: {
    locality: {
      title: "stratotype.locality",
      value: "locality",
      show: true,
      apiFieldValue: { et: "locality__locality", en: "locality_locality_en" },
      sortField: { et: ["locality__locality"], en: ["locality_locality_en"] },
    },
    type: {
      title: "stratotype.type",
      value: "type",
      show: true,
      apiFieldValue: {
        et: "stratotype_type__value",
        en: "stratotype_type__value_en",
      },
      sortField: { et: ["stratotype_type__value"], en: ["stratotype_type__value_en"] },
    },
    depth_top: {
      title: "stratotype.depthTop",
      value: "depth_top",
      show: true,
      apiFieldValue: "depth_top",
      sortField: ["depth_top"],
    },
    depth_base: {
      title: "stratotype.depthBase",
      value: "depth_base",
      show: true,
      apiFieldValue: "depth_base",
      sortField: ["depth_base"],
    },
    reference: {
      title: "stratotype.reference",
      value: "reference",
      show: true,
      apiFieldValue: "reference__reference",
      sortField: ["reference__reference"],
    },
    remarks: {
      title: "stratotype.remarks",
      value: "remarks",
      show: true,
      apiFieldValue: "remarks",
      sortField: ["remarks"],
    },
  },
  allIds: [
    "locality",
    "type",
    "depth_top",
    "depth_base",
    "reference",
    "remarks",
  ],
};

export const HEADERS_TAXON_LIST: Headers = {
  byIds: {
    taxon: {
      title: "taxon.taxon",
      value: "taxon",
      show: true,
      apiFieldValue: "taxon__taxon",
      sortField: ["taxon__taxon"],
    },
    name: {
      title: "taxon.name",
      value: "name",
      show: true,
      apiFieldValue: "name",
      sortField: ["name"],
    },
    frequency: {
      title: "taxon.frequency",
      value: "frequency",
      show: true,
      apiFieldValue: "frequency",
      sortField: ["frequency"],
    },
    agent: {
      title: "taxon.agent_identified",
      value: "agent",
      show: true,
      apiFieldValue: "agent_identified__agent,agent_identified_txt",
      sortField: ["agent_identified__agent", "agent_identified_txt"],
    },
    date_identified: {
      title: "taxon.date_identified",
      value: "date_identified",
      show: true,
      apiFieldValue: "date_identified,date_identified_free",
      sortField: ["date_identified", "date_identified_free"],
    },
    extra: {
      title: "taxon.extra",
      value: "extra",
      show: true,
      apiFieldValue: "extra",
      sortField: ["extra"],
    },
    remarks: {
      title: "taxon.remarks",
      value: "remarks",
      show: true,
      apiFieldValue: "remarks",
      sortField: ["remarks"],
    },
  },
  allIds: [
    "taxon",
    "name",
    "frequency",
    "agent",
    "date_identified",
    "extra",
    "remarks",
  ],
};
