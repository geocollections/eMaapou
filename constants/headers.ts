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

export const numberFieldProps: Partial<Header> = {
  align: "end",
  cellProps(data) {
    return {
      style: "font-family: 'Noto Sans Mono', monospace;",
      class: "text-body-2",
    };
  },
};

const COLUMN_SIZE_ULTRA_WIDE = "40em";
const COLUMN_SIZE_WIDE = "20em";
const COLUMN_SIZE_NORMAL = "12em";
const COLUMN_SIZE_NARROW = "8em";

export const narrowColumn = {
  width: COLUMN_SIZE_NARROW,
  minWidth: COLUMN_SIZE_NARROW,
};

export const normalColumn = {
  width: COLUMN_SIZE_NORMAL,
  minWidth: COLUMN_SIZE_NORMAL,
};

export const wideColumn = {
  width: COLUMN_SIZE_WIDE,
  minWidth: COLUMN_SIZE_WIDE,
};

export const ultraWideColumn = {
  width: COLUMN_SIZE_ULTRA_WIDE,
  minWidth: COLUMN_SIZE_ULTRA_WIDE,
};

export const HEADERS_ANALYSIS: Headers = {
  byIds: {
    id: {
      title: "analysis.id",
      value: "id",
      show: true,
      apiFieldValue: "id_l",
      sortField: ["id_l"],
      ...narrowColumn,
    },
    sample_name: {
      title: "analysis.sample",
      value: "sample_name",
      show: true,
      apiFieldValue: "sample_number",
      sortField: ["sample_name"],
      ...narrowColumn,
    },
    locality: {
      title: "analysis.locality",
      value: "locality",
      show: true,
      apiFieldValue: { et: "locality", en: "locality_en" },
      sortField: { et: ["locality"], en: ["locality_en"] },
      ...wideColumn,
    },
    depth: {
      title: "analysis.depth",
      value: "depth",
      show: true,
      sortable: false,
      align: "end",
      children: [
        {
          title: "common.from",
          value: "depthFrom",
          apiFieldValue: "depth",
          sortField: ["depth"],
          sortable: true,
          ...numberFieldProps,
          ...narrowColumn,
        },
        {
          title: "common.to",
          value: "depthTo",
          apiFieldValue: "depth_interval",
          sortField: ["depth_interval"],
          sortable: true,
          ...numberFieldProps,
          ...narrowColumn,
        },
      ],
    },
    method: {
      title: "analysis.method",
      value: "method",
      show: true,
      apiFieldValue: { et: "analysis_method", en: "analysis_method_en" },
      sortField: { et: ["analysis_method"], en: ["analysis_method_en"] },
      ...normalColumn,
    },
    method_details: {
      title: "analysis.methodDetails",
      value: "method_details",
      show: true,
      apiFieldValue: { et: "method_details", en: "method_details_en" },
      sortField: { et: ["method_details"], en: ["method_details_en"] },
      ...normalColumn,
    },
    agent: {
      title: "analysis.analysedBy",
      value: "agent",
      show: true,
      apiFieldValue: "agent",
      sortField: ["agent"],
      ...normalColumn,
    },
    date: {
      title: "analysis.date",
      value: "date",
      show: true,
      apiFieldValue: "date",
      sortField: ["date"],
      ...normalColumn,
    },
  },
  allIds: [
    "id",
    "sample_name",
    "locality",
    "depth",
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
      apiFieldValue: "analysis_id_l",
      sortField: ["analysis_id_l"],
      ...narrowColumn,
    },
    analysis_method: {
      title: "analyticalData.analysisMethod",
      value: "analysis_method",
      show: true,
      apiFieldValue: { et: "analysis_method", en: "analysis_method_en" },
      sortField: { et: ["analysis_method"], en: ["analysis_method_en"] },
      ...normalColumn,
    },
    sample_number: {
      title: "analyticalData.sample",
      value: "sample_number",
      show: true,
      apiFieldValue: "sample_number,sample_id_l",
      sortField: ["sample_number", "sample_id_l"], // TODO: need to combine these two fields in Solr index
      ...narrowColumn,
    },
    locality: {
      title: "analyticalData.locality",
      value: "locality",
      show: true,
      apiFieldValue: "locality,locality_id_sl,site,site_id_sl",
      sortField: ["locality", "site"], // TODO: need to combine these two fields in Solr index, not sure how it should be done. Can one document have both fields defined?
      ...wideColumn,
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
      ...normalColumn,
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
      ...normalColumn,
    },
    depth: {
      title: "analyticalData.depth",
      value: "depth",
      show: true,
      sortable: false,
      align: "end",
      children: [
        {
          title: "common.from",
          value: "depthFrom",
          apiFieldValue: "depth",
          sortField: ["depth"],
          sortable: true,
          ...numberFieldProps,
          ...narrowColumn,
        },
        {
          title: "common.to",
          value: "depthTo",
          apiFieldValue: "depth_interval",
          sortField: ["depth_interval"],
          sortable: true,
          ...numberFieldProps,
          ...narrowColumn,
        },
      ],
    },
    // depth: {
    //   title: "analyticalData.depth",
    //   value: "depth",
    //   show: true,
    //   apiFieldValue: "depth",
    //   sortField: ["depth"],
    //   ...numberFieldProps,
    //   ...smallColumn,
    // },
    // depth_interval: {
    //   title: "analyticalData.depthInterval",
    //   value: "depth_interval",
    //   show: true,
    //   apiFieldValue: "depth_interval",
    //   sortField: ["depth_interval"],
    //   ...numberFieldProps,
    //   ...smallColumn,
    // },
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
      ...normalColumn,
    },
    reference: {
      title: "analyticalData.reference",
      value: "reference",
      show: true,
      apiFieldValue: "reference,reference_id_sl",
      sortField: ["reference"],
      ...wideColumn,
    },
    dataset_id: {
      title: "analyticalData.dataset",
      value: "dataset_id",
      show: true,
      apiFieldValue: "dataset_id_sl,dataset_name",
      sortField: ["dataset_name"],
      ...normalColumn,
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
    // "depth_interval",
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
      ...narrowColumn,
    },
    name: {
      title: "area.name",
      value: "name",
      show: true,
      apiFieldValue: { et: "name", en: "name_en" },
      sortField: { et: ["name"], en: ["name_en"] },
      ...wideColumn,
    },
    county: {
      title: "area.county",
      value: "county",
      show: true,
      apiFieldValue: { et: "maakond", en: "maakond_en" },
      sortField: { et: ["maakond"], en: ["maakond_en"] },
      ...normalColumn,
    },
    type: {
      title: "area.areaType",
      value: "type",
      show: true,
      apiFieldValue: { et: "area_type", en: "area_type_en" },
      sortField: { et: ["area_type"], en: ["area_type_en"] },
      ...normalColumn,
    },
    size: {
      title: "area.areaHa",
      value: "size",
      show: true,
      apiFieldValue: "area_ha",
      sortField: ["area_ha"],
      ...numberFieldProps,
      ...narrowColumn,
    },
    miner: {
      title: "area.miner",
      value: "miner",
      show: false,
      apiFieldValue: "kaevandaja",
      sortField: ["kaevandaja"],
      ...normalColumn,
    },
    miningPermit: {
      title: "area.miningPermit",
      value: "miningPermit",
      show: false,
      apiFieldValue: "loa_number",
      sortField: ["loa_number"],
      ...normalColumn,
    },
    miningPermitOwner: {
      title: "area.miningPermitOwner",
      value: "miningPermitOwner",
      show: false,
      apiFieldValue: "loa_omanik",
      sortField: ["loa_omanik"],
      ...normalColumn,
    },
  },
  allIds: ["id", "name", "county", "type", "size", "miner", "miningPermit", "miningPermitOwner"],
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
export const HEADERS_ATTACHMENT_SOLR: Headers = {
  byIds: {
    id: { title: "attachment.id", value: "id", show: true, apiFieldValue: "id", sortField: ["id"] },
    format_value: {
      title: "attachment.format",
      value: "format_value",
      show: true,
      apiFieldValue: "format_value",
      sortField: ["format_value"],
    },
    image_number: {
      title: "attachment.image_number",
      value: "image_number",
      show: true,
      apiFieldValue: "image_number",
      sortField: ["image_number"],
    },
    agent: {
      title: "attachment.author",
      value: "agent",
      show: true,
      apiFieldValue: "agent",
      sortField: ["agent"],
    },
    date: {
      title: "attachment.date",
      value: "date",
      show: true,
      apiFieldValue: "date_created,date_created_free",
      sortField: ["date_created", "date_created_free"],
    },
    reference: {
      title: "attachment.reference",
      value: "reference",
      show: true,
      apiFieldValue: "reference",
      sortField: ["reference"],
    },
    type: {
      title: "attachment.type",
      value: "type",
      show: true,
      apiFieldValue: "type",
      sortField: ["type"],
    },
    image: {
      title: "attachment.image",
      value: "image",
      show: true,
      apiFieldValue: "uuid_filename",
      sortable: false,
    },
  },
  allIds: [
    "id",
    "format_value",
    "image_number",
    "agent",
    "date",
    "reference",
    "type",
    "image",
  ],
};

export const HEADERS_ATTACHMENT_LINK_SOLR: Headers = {
  byIds: {
    table: {
      title: "attachmentLink.table",
      value: "table",
      show: true,
      sortField: ["table"],
    },
    name: {
      title: "attachmentLink.name",
      value: "name",
      show: true,
      sortField: { et: ["name"], en: ["name_en"] },
    },
  },
  allIds: ["table", "name"],
};

export const HEADERS_DATASET: Headers = {
  byIds: {
    id: {
      title: "dataset.id",
      value: "id",
      show: false,
      apiFieldValue: "dataset_id",
      sortField: ["dataset_id"],
      ...narrowColumn,
    },
    name: {
      title: "dataset.name",
      value: "name",
      show: true,
      apiFieldValue: { et: "name", en: "name_en" },
      sortField: { et: ["name"], en: ["name_en"] },
      ...ultraWideColumn,
    },
    date: {
      title: "dataset.date",
      value: "date",
      show: true,
      apiFieldValue: "date,date_txt",
      sortField: ["date", "date_txt"],
      ...normalColumn,
    },
    database: {
      title: "dataset.database",
      value: "database_acronym",
      show: true,
      apiFieldValue: "database_acronym",
      sortField: ["database_acronym"],
      ...narrowColumn,
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

export const HEADERS_DOI: Headers = {
  byIds: {
    identifier: {
      title: "doi.identifier",
      value: "identifier",
      show: true,
      apiFieldValue: "identfier",
      sortField: ["identfier"],
    },
    creator: {
      title: "doi.creators",
      value: "creators",
      show: true,
      apiFieldValue: "creators",
      sortField: ["creators"],
    },
    reference_year: {
      title: "doi.reference_year",
      value: "reference_year",
      show: true,
      apiFieldValue: "reference_year",
      sortField: ["reference_year"],
    },
    title: {
      title: "doi.table_title",
      value: "title",
      show: true,
      apiFieldValue: "title",
      sortField: ["title"],
    },
    resource: {
      title: "doi.resource",
      value: "resource",
      show: true,
      apiFieldValue: "resource",
      sortField: ["resource"],
    },
    datacite_created: {
      title: "doi.datacite_created",
      value: "datacite_created",
      show: true,
      apiFieldValue: "datacite_created",
      sortField: ["datacite_created"],
    },
  },
  allIds: [
    "identifier",
    "creator",
    "reference_year",
    "title",
    "resource",
    "datacite_created",
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
      ...narrowColumn,
    },
    drillcore: {
      title: "drillcore.name",
      value: "drillcore",
      show: true,
      apiFieldValue: { et: "drillcore", en: "drillcore_en" },
      sortField: { et: ["drillcore"], en: ["drillcore_en"] },
      ...wideColumn,
    },
    depth: {
      title: "drillcore.depth",
      value: "depth",
      show: true,
      apiFieldValue: "depth",
      sortField: ["depth"],
      ...numberFieldProps,
      ...normalColumn,
      align: "start",
    },
    boxes: {
      title: "drillcore.boxes",
      value: "boxes",
      show: true,
      apiFieldValue: "boxes",
      sortField: ["boxes"],
      ...numberFieldProps,
      ...narrowColumn,
    },
    box_numbers: {
      title: "drillcore.boxNumbers",
      value: "box_numbers",
      show: true,
      apiFieldValue: "box_numbers",
      sortField: ["box_numbers"],
      ...numberFieldProps,
      ...normalColumn,
    },
    year: {
      title: "drillcore.year",
      value: "year",
      show: true,
      apiFieldValue: "year",
      sortField: ["year"],
      ...normalColumn,
    },
    core_repository: {
      title: "drillcore.storage",
      value: "core_repository",
      show: true,
      apiFieldValue: { et: "core_repository", en: "core_repository_en" },
      sortField: { et: ["core_repository"], en: ["core_repository_en"] },
      ...normalColumn,
    },
    acronym: {
      title: "drillcore.acronym",
      value: "acronym",
      show: true,
      apiFieldValue: "acronym",
      sortField: ["acronym"],
      ...narrowColumn,
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
      ...narrowColumn,
    },
    locality: {
      title: "locality.name",
      value: "locality",
      show: true,
      apiFieldValue: { et: "locality", en: "locality_en" },
      sortField: { et: ["locality"], en: ["locality_en"] },
      ...wideColumn,
    },
    country: {
      title: "locality.country",
      value: "country",
      show: true,
      apiFieldValue: { et: "country", en: "country_en" },
      sortField: { et: ["country"], en: ["country_en"] },
      ...normalColumn,
    },
    coordinates: {
      title: "locality.coordinates",
      value: "coordinates",
      show: true,
      sortable: false,
      ...numberFieldProps,
      ...normalColumn,
      align: "start",
    },
    references: {
      title: "locality.relatedReferences",
      value: "references",
      show: true,
      sortable: false,
      apiFieldValue: "related_references",
      sortField: ["related_references"],
      ...numberFieldProps,
      ...narrowColumn,
    },
    specimens: {
      title: "locality.relatedSpecimens",
      value: "specimens",
      show: true,
      apiFieldValue: "related_specimens",
      sortField: ["related_specimens"],
      ...numberFieldProps,
      ...narrowColumn,
    },
    samples: {
      title: "locality.relatedSamples",
      value: "samples",
      show: true,
      apiFieldValue: "related_samples",
      sortField: ["related_samples"],
      ...numberFieldProps,
      ...narrowColumn,
    },
    analyses: {
      title: "locality.relatedAnalyses",
      value: "analyses",
      show: true,
      apiFieldValue: "related_analyses",
      sortField: ["related_analyses"],
      ...numberFieldProps,
      ...narrowColumn,
    },
    drillcores: {
      title: "locality.relatedDrillcores",
      value: "drillcores",
      show: false,
      apiFieldValue: "related_drillcores",
      sortField: ["related_drillcores"],
      ...numberFieldProps,
      ...narrowColumn,
    },
    files: {
      title: "locality.relatedFiles",
      value: "files",
      show: false,
      apiFieldValue: "related_files",
      sortField: ["related_files"],
      ...numberFieldProps,
      ...narrowColumn,
    },
    images: {
      title: "locality.relatedImages",
      value: "images",
      show: false,
      apiFieldValue: "related_images",
      sortField: ["related_images"],
      ...numberFieldProps,
      ...narrowColumn,
    },
    stratotypes: {
      title: "locality.relatedStratotypes",
      value: "stratotypes",
      show: false,
      apiFieldValue: "related_stratotypes",
      sortField: ["related_stratotypes"],
      ...numberFieldProps,
      ...narrowColumn,
    },
    taxonOccurrences: {
      title: "locality.relatedTaxonOccurrences",
      value: "taxonOccurrences",
      show: false,
      apiFieldValue: "related_taxon_occurrences",
      sortField: ["related_taxon_occurrences"],
      ...numberFieldProps,
      ...narrowColumn,
    },
  },
  allIds: [
    "id",
    "locality",
    "country",
    "coordinates",
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

export const HEADERS_PHOTO: Headers = {
  byIds: {
    id: {
      title: "photo.id",
      value: "id",
      show: true,
      apiFieldValue: "id_sl",
      sortField: ["id_sl"],
      ...narrowColumn,
    },
    image_number: {
      title: "photo.number",
      value: "image_number",
      show: true,
      apiFieldValue: "image_number",
      sortField: ["image_number"],
      ...narrowColumn,
    },
    agent: {
      title: "photo.agent",
      value: "agent",
      show: true,
      apiFieldValue: "agent",
      sortField: ["agent"],
      ...normalColumn,
    },
    date: {
      title: "photo.date",
      value: "date",
      show: true,
      apiFieldValue: "date_created_dt,date_created_free",
      sortField: ["date_created_dt", "date_created_free"],
      ...normalColumn,
    },
    locality: {
      title: "photo.locality",
      value: "locality",
      show: true,
      apiFieldValue: { et: "locality", en: "locality_en" },
      sortField: { et: ["locality"], en: ["locality_en"] },
      ...wideColumn,
    },
    image_object: {
      title: "photo.imageObject",
      value: "image_object",
      show: true,
      apiFieldValue: "image_object",
      sortField: ["image_object"],
      ...wideColumn,
    },
    tags: {
      title: "photo.tags",
      value: "tags",
      show: true,
      apiFieldValue: "tags",
      sortField: ["tags"],
      ...wideColumn,
    },
    image: {
      title: "photo.image",
      value: "image",
      show: true,
      apiFieldValue: "filename",
      sortable: false,
      ...normalColumn,
    },
  },
  allIds: [
    "id",
    "image_number",
    "agent",
    "date",
    "locality",
    "image_object",
    "tags",
    "image",
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
      ...narrowColumn,
    },
    preparation_number: {
      title: "preparation.number",
      value: "preparation_number",
      show: true,
      apiFieldValue: "preparation_number",
      sortField: ["preparation_number"],
      ...normalColumn,
    },
    locality: {
      title: "preparation.locality",
      value: "locality",
      show: true,
      apiFieldValue: { et: "locality", en: "locality_en" },
      sortField: { et: ["locality"], en: ["locality_en"] },
      ...wideColumn,
    },
    depth: {
      title: "preparation.depth",
      value: "depth",
      show: true,
      sortable: false,
      align: "end",
      children: [
        {
          title: "common.from",
          value: "depthFrom",
          apiFieldValue: "depth",
          sortField: ["depth"],
          sortable: true,
          ...numberFieldProps,
          ...narrowColumn,
        },
        {
          title: "common.to",
          value: "depthTo",
          apiFieldValue: "depth_interval",
          sortField: ["depth_interval"],
          sortable: true,
          ...numberFieldProps,
          ...narrowColumn,
        },
      ],
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
      ...wideColumn,
    },
    agent: {
      title: "preparation.agent",
      value: "agent",
      show: true,
      apiFieldValue: "agent",
      sortField: ["agent"],
      ...normalColumn,
    },
    mass: {
      title: "preparation.mass",
      value: "mass",
      show: true,
      apiFieldValue: "mass",
      sortField: ["mass"],
      ...numberFieldProps,
      ...normalColumn,
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

export const HEADERS_REFERENCE: Headers = {
  byIds: {
    id: { title: "reference.id", value: "id", show: true, apiFieldValue: "id", sortField: ["id"] },
    reference: {
      title: "reference.reference",
      value: "reference",
      show: true,
      apiFieldValue: "reference",
      sortField: ["reference"],
    },
    author: {
      title: "reference.author",
      value: "author",
      show: true,
      apiFieldValue: "author",
      sortField: ["author"],
    },
    year: {
      title: "reference.year",
      value: "year",
      show: true,
      apiFieldValue: "year",
      sortField: ["year"],
    },
    title: {
      title: "reference.title",
      value: "title",
      show: true,
      apiFieldValue: "title",
      sortField: ["title"],
    },
    journal: {
      title: "reference.journalBook",
      value: "journal",
      show: true,
      apiFieldValue: "journal__journal_name,book",
      sortField: ["journal__journal_name", "book"],
    },
    pages: {
      title: "reference.pages",
      value: "pages",
      show: true,
      apiFieldValue: "pages",
      sortField: ["pages"],
    },
    doi: {
      title: "reference.doi",
      value: "doi",
      show: true,
      apiFieldValue: "doi",
      sortField: ["doi"],
    },
    remarks: {
      title: "reference.remarks",
      value: "remarks",
      show: true,
      apiFieldValue: "remarks",
      sortField: ["remarks"],
    },
    pdf: {
      title: "reference.pdf",
      value: "pdf",
      show: true,
      apiFieldValue: "pdf",
      sortField: ["pdf"],
    },
  },
  allIds: [
    "id",
    "reference",
    "author",
    "year",
    "title",
    "journal",
    "doi",
    "remarks",
    "pdf",
  ],
};

export const HEADERS_ROCK: Headers = {
  byIds: {
    id: { title: "rock.id", value: "id", show: true, apiFieldValue: "id", sortField: ["id"] },
    name: {
      title: "rock.name",
      value: "name",
      show: true,
      apiFieldValue: "name",
      sortField: ["name"],
    },
    name_en: {
      title: "rock.name_en",
      value: "name_en",
      show: true,
      apiFieldValue: "name_en",
      sortField: ["name_en"],
    },
    formula: {
      title: "rock.formula",
      value: "formula",
      show: true,
      apiFieldValue: "formula,formula_html",
      sortField: ["formula", "formula_html"],
    },
    in_estonia: {
      title: "rock.in_estonia",
      value: "in_estonia",
      show: true,
      apiFieldValue: "in_estonia",
      sortField: ["in_estonia"],
    },
    mindat_id: {
      title: "rock.mindat",
      value: "mindat_id",
      show: true,
      apiFieldValue: "mindat_id",
      sortField: ["mindat_id"],
    },
  },
  allIds: ["id", "name", "name_en", "formula", "in_estonia", "mindat_id"],
};

export const HEADERS_SAMPLE: Headers = {
  byIds: {
    id: {
      title: "sample.id",
      value: "id",
      show: true,
      apiFieldValue: "id_l",
      ...narrowColumn,
    },
    number: {
      title: "sample.number",
      value: "number",
      show: true,
      apiFieldValue: "number",
      ...narrowColumn,
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
      ...wideColumn,
    },
    depth: {
      title: "sample.depth",
      value: "depth",
      show: true,
      sortable: false,
      align: "end",
      children: [
        {
          title: "common.from",
          value: "depthFrom",
          apiFieldValue: "depth",
          sortField: ["depth"],
          sortable: true,
          ...numberFieldProps,
          ...narrowColumn,
        },
        {
          title: "common.to",
          value: "depthTo",
          apiFieldValue: "depth_interval",
          sortField: ["depth_interval"],
          sortable: true,
          ...numberFieldProps,
          ...narrowColumn,
        },
      ],
    },
    stratigraphy: {
      title: "sample.stratigraphy",
      value: "stratigraphy",
      show: true,
      apiFieldValue: { et: "stratigraphy", en: "stratigraphy_en" },
      sortField: { et: ["stratigraphy"], en: ["stratigraphy_en"] },
      ...normalColumn,
    },
    lithostratigraphy: {
      title: "sample.lithostratigraphy",
      value: "lithostratigraphy",
      show: false,
      apiFieldValue: { et: "lithostratigraphy", en: "lithostratigraphy_en" },
      sortField: { et: ["lithostratigraphy"], en: ["lithostratigraphy_en"] },
      ...normalColumn,
    },
    collector: {
      title: "sample.collector",
      value: "collector",
      show: true,
      apiFieldValue: "collector",
      ...normalColumn,
    },
    dateCollected: {
      title: "sample.dateCollected",
      value: "date_collected",
      show: true,
      apiFieldValue: "date_collected",
      ...normalColumn,
    },
    image: {
      title: "sample.image",
      value: "image",
      show: true,
      apiFieldValue: "image",
      sortable: false,
      ...normalColumn,
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

export const HEADERS_SAMPLE_ANALYSIS_RESULT: Headers = {
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
    method_details: {
      title: "analysisResult.methodDetails",
      value: "method_details",
      show: true,
      apiFieldValue: "method_details",
      sortField: ["method_details"],
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
    value: { title: "analysisResult.value", value: "value", show: true, sortField: ["value"] },
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
    "method_details",
    "depth",
    "depth_interval",
    "value",
    "value_txt",
    "value_error",
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
      ...narrowColumn,
    },
    name: {
      title: "site.name",
      value: "name",
      show: true,
      apiFieldValue: { et: "name", en: "name_en" },
      sortField: ["name"],
      ...wideColumn,
    },
    area: {
      title: "site.area",
      value: "area",
      show: true,
      apiFieldValue: { et: "area_name", en: "area_name_en" },
      sortField: { et: ["area_name"], en: ["area_name_en"] },
      ...wideColumn,
    },
    coordinates: {
      title: "locality.coordinates",
      value: "coordinates",
      show: true,
      sortable: false,
      ...numberFieldProps,
      ...normalColumn,
      align: "start",
    },
    elevation: {
      title: "site.elevation",
      value: "elevation",
      show: true,
      apiFieldValue: "z",
      sortField: ["z"],
      ...narrowColumn,
      ...numberFieldProps,
    },
    depth: {
      title: "site.depth",
      value: "depth",
      show: true,
      apiFieldValue: "depth",
      sortField: ["depth"],
      ...numberFieldProps,
      ...narrowColumn,
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
      ...narrowColumn,
    },
    specimen_full_name: {
      title: "specimen.number",
      value: "specimen_full_name",
      show: true,
      apiFieldValue: "specimen_full_name",
      sortField: ["specimen_full_name"],
      ...normalColumn,
    },
    specimen_number_old: {
      title: "specimen.oldNumber",
      value: "specimen_number_old",
      show: false,
      apiFieldValue: "specimen_number_old",
      sortField: ["specimen_number_old"],
      ...normalColumn,
    },
    original_status: {
      title: "specimen.originalStatus",
      value: "original_status",
      show: false,
      apiFieldValue: { et: "original_status", en: "original_status_en" },
      sortField: { et: ["original_status"], en: ["original_status_en"] },
      ...normalColumn,
    },
    locality: {
      title: "specimen.locality",
      value: "locality",
      show: true,
      apiFieldValue: { et: "locality", en: "locality_en" },
      sortField: { et: ["locality"], en: ["locality_en"] },
      ...wideColumn,
    },
    depth: {
      title: "specimen.depth",
      value: "depth",
      show: true,
      sortable: false,
      align: "end",
      children: [
        {
          title: "common.from",
          value: "depthFrom",
          apiFieldValue: "depth",
          sortField: ["depth"],
          sortable: true,
          ...numberFieldProps,
          ...narrowColumn,
        },
        {
          title: "common.to",
          value: "depthTo",
          apiFieldValue: "depth_interval",
          sortField: ["depth_interval"],
          sortable: true,
          ...numberFieldProps,
          ...narrowColumn,
        },
      ],
    },
    stratigraphy: {
      title: "specimen.stratigraphy",
      value: "stratigraphy",
      show: true,
      apiFieldValue: { et: "stratigraphy", en: "stratigraphy_en" },
      sortField: { et: ["stratigraphy"], en: ["stratigraphy_en"] },
      ...normalColumn,
    },
    lithostratigraphy: {
      title: "sample.lithostratigraphy",
      value: "lithostratigraphy",
      show: false,
      apiFieldValue: { et: "lithostratigraphy", en: "lithostratigraphy_en" },
      sortField: { et: ["lithostratigraphy"], en: ["lithostratigraphy_en"] },
      ...normalColumn,
    },
    name: {
      title: "specimen.name",
      value: "name",
      show: true,
      sortable: false,
      class: "static-cell-header",
      apiFieldValue: { et: "rock", en: "rock_en" },
      sortField: { et: ["rock"], en: ["rock_en"] },
      ...normalColumn,
    },
    image: {
      title: "specimen.image",
      value: "image",
      show: true,
      apiFieldValue: "image",
      sortable: false,
      ...normalColumn,
    },
    collector: {
      title: "specimen.collector",
      value: "collector",
      show: false,
      apiFieldValue: "collector",
      sortField: ["collector"],
      ...normalColumn,
    },
  },
  allIds: [
    "id",
    "specimen_full_name",
    "specimen_number_old",
    "name",
    "locality",
    "depth",
    "stratigraphy",
    "lithostratigraphy",
    "original_status",
    "collector",
    "image",
  ],
};

export const HEADERS_SPECIMEN_IDENTIFICATION: Headers = {
  byIds: {
    name: {
      title: "specimenIdentification.name",
      value: "name",
      show: true,
      apiFieldValue: "taxon__taxon",
      sortField: ["taxon__taxon"],
    },
    agent: {
      title: "specimenIdentification.agent",
      value: "agent",
      show: true,
      apiFieldValue: "agent__agent",
      sortField: ["agent__agent"],
    },
    dateIdentified: {
      title: "specimenIdentification.dateIdentified",
      value: "dateIdentified",
      show: true,
      apiFieldValue: "date_identified",
      sortField: ["date_identified"],
    },
    reference: {
      title: "specimenIdentification.reference",
      value: "reference",
      show: true,
      apiFieldValue: "reference__reference",
      sortField: ["reference__reference"],
    },
    type: {
      title: "specimenIdentification.type",
      value: "type",
      show: true,
      apiFieldValue: {
        et: "identification_type__value",
        en: "identification_type__value_en",
      },
      sortField: {
        et: ["identification_type__value"],
        en: ["identification_type__value_en"],
      },
    },
    remarks: {
      title: "specimenIdentification.remarks",
      value: "remarks",
      show: true,
      apiFieldValue: "remarks",
      sortField: ["remarks"],
    },
    current: {
      title: "specimenIdentification.current",
      value: "current",
      show: true,
      apiFieldValue: "current",
      sortField: ["current"],
    },
  },
  allIds: [
    "name",
    "agent",
    "dateIdentified",
    "reference",
    "type",
    "remarks",
    "current",
  ],
};

export const HEADERS_SPECIMEN_IDENTIFICATION_GEOLOGY: Headers = {
  byIds: {
    rock: {
      title: "specimenIdentification.rock",
      value: "rock",
      show: true,
      apiFieldValue: "rock__name,rock__name_en",
      sortField: ["rock__name", "rock__name_en"],
    },
    name: {
      title: "specimenIdentification.name",
      value: "name",
      show: true,
      apiFieldValue: "name",
      sortField: ["name"],
    },
    name_en: {
      title: "specimenIdentification.name_en",
      value: "name_en",
      show: true,
      apiFieldValue: "name_en",
      sortField: ["name_en"],
    },
    agent: {
      title: "specimenIdentification.agent",
      value: "agent",
      show: true,
      apiFieldValue: "agent__agent",
      sortField: ["agent__agent"],
    },
    dateIdentified: {
      title: "specimenIdentification.dateIdentified",
      value: "dateIdentified",
      show: true,
      apiFieldValue: "date_identified",
      sortField: ["date_identified"],
    },
    reference: {
      title: "specimenIdentification.reference",
      value: "reference",
      show: true,
      apiFieldValue: "reference__reference",
      sortField: ["reference__reference"],
    },
    type: {
      title: "specimenIdentification.type",
      value: "type",
      show: true,
      apiFieldValue: { et: "type__value", en: "type__value_en" },
      sortField: { et: ["type__value"], en: ["type__value_en"] },
    },
    remarks: {
      title: "specimenIdentification.remarks",
      value: "remarks",
      show: true,
      apiFieldValue: "remarks",
      sortField: ["remarks"],
    },
    current: {
      title: "specimenIdentification.current",
      value: "current",
      show: true,
      apiFieldValue: "current",
      sortField: ["current"],
    },
    // pages: {
    //   title: 'stratigraphyReference.pages',
    //   value: 'pages',
    //   show: true,
    // },
  },
  allIds: [
    "rock",
    "name",
    "name_en",
    "agent",
    "dateIdentified",
    "reference",
    "type",
    "remarks",
    "current",
  ],
};

export const HEADERS_SPECIMEN_REFERENCE: Headers = {
  byIds: {
    reference: {
      title: "specimenReference.reference",
      value: "reference",
      show: true,
      apiFieldValue: "reference__reference",
      sortField: ["reference__reference"],
    },
    pages: {
      title: "specimenReference.pages",
      value: "pages",
      show: true,
      apiFieldValue: "pages",
      sortField: ["pages"],
    },
    figures: {
      title: "specimenReference.figures",
      value: "figures",
      show: true,
      apiFieldValue: "figures",
      sortField: ["figures"],
    },
    remarks: {
      title: "specimenReference.remarks",
      value: "remarks",
      show: true,
      apiFieldValue: "remarks",
      sortField: ["remarks"],
    },
  },
  allIds: ["reference", "pages", "figures", "remarks"],
};

export const HEADERS_STRATIGRAPHY: Headers = {
  byIds: {
    id: {
      title: "stratigraphy.id",
      value: "id",
      show: false,
      apiFieldValue: "id",
      sortField: ["id"],
      ...narrowColumn,
    },
    stratigraphy: {
      title: "stratigraphy.stratigraphy",
      value: "stratigraphy",
      show: true,
      apiFieldValue: { et: "stratigraphy", en: "stratigraphy_en" },
      sortField: { et: ["stratigraphy"], en: ["stratigraphy_en"] },
      ...wideColumn,
    },
    index_main: {
      title: "stratigraphy.index_main",
      value: "index_main",
      show: true,
      apiFieldValue: "index_main",
      sortField: ["index_main"],
      ...narrowColumn,
    },
    index_additional: {
      title: "stratigraphy.index_additional",
      value: "index_additional",
      show: true,
      apiFieldValue: "index_additional",
      sortField: ["index_additional"],
      ...narrowColumn,
    },
    stratigraphy_type: {
      title: "stratigraphy.stratigraphy_type",
      value: "stratigraphy_type",
      show: true,
      apiFieldValue: { et: "stratigraphy_type", en: "stratigraphy_type_en" },
      sortField: { et: ["stratigraphy_type"], en: ["stratigraphy_type_en"] },
      ...normalColumn,
    },
    stratigraphy_rank: {
      title: "stratigraphy.stratigraphy_rank",
      value: "stratigraphy_rank",
      show: true,
      apiFieldValue: { et: "stratigraphy_rank", en: "stratigraphy_rank_en" },
      sortField: { et: ["stratigraphy_rank"], en: ["stratigraphy_rank_en"] },
      ...normalColumn,
    },
    stratigraphy_scope: {
      title: "stratigraphy.stratigraphy_scope",
      value: "stratigraphy_scope",
      show: true,
      apiFieldValue: { et: "stratigraphy_scope", en: "stratigraphy_scope_en" },
      sortField: { et: ["stratigraphy_scope"], en: ["stratigraphy_scope_en"] },
      ...normalColumn,
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
      ...wideColumn,
    },
    age: {
      title: "stratigraphy.age",
      value: "age",
      show: true,
      sortable: false,
      align: "end",
      children: [
        {
          title: "common.base",
          value: "ageBase",
          apiFieldValue: "age_base",
          sortField: ["age_base"],
          sortable: true,
          ...numberFieldProps,
          ...narrowColumn,
        },
        {
          title: "common.top",
          value: "ageTop",
          apiFieldValue: "age_top",
          sortField: ["age_top"],
          sortable: true,
          ...numberFieldProps,
          ...narrowColumn,
        },
      ],
    },
    // ageBase: {
    //   title: "stratigraphy.ageBase",
    //   value: "ageBase",
    //   show: true,
    //   apiFieldValue: "age_base",
    //   sortField: ["age_base"],
    //   ...numberFieldProps,
    // },
    // ageTop: {
    //   title: "stratigraphy.ageTop",
    //   value: "ageTop",
    //   show: true,
    //   apiFieldValue: "age_top",
    //   sortField: ["age_top"],
    //   ...numberFieldProps,
    // },
    age_stratigraphy: {
      title: "stratigraphy.age_stratigraphy",
      value: "age_stratigraphy",
      show: true,
      apiFieldValue: { et: "age_stratigraphy", en: "age_stratigraphy_en" },
      sortField: { et: ["age_stratigraphy"], en: ["age_stratigraphy_en"] },
      ...normalColumn,
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
    "age",
    "age_stratigraphy",
  ],
};

export const HEADERS_STRATIGRAPHY_REFERENCE: Headers = {
  byIds: {
    reference: {
      title: "stratigraphyReference.reference",
      value: "reference",
      show: true,
      apiFieldValue: "reference__reference",
      sortField: ["reference__reference"],
    },
    content: {
      title: "stratigraphyReference.content",
      value: "content",
      show: true,
      apiFieldValue: "reference__year",
      sortField: ["reference__year"],
    },
    year: {
      title: "stratigraphyReference.year",
      value: "year",
      show: true,
      apiFieldValue: "pages",
      sortField: ["pages"],
    },
    pages: {
      title: "stratigraphyReference.pages",
      value: "pages",
      show: true,
      apiFieldValue: "remarks",
      sortField: ["remarks"],
    },
    remarks: {
      title: "stratigraphyReference.remarks",
      value: "remarks",
      show: true,
      apiFieldValue: { et: "content", en: "content_en" },
      sortField: { et: ["content"], en: ["content_en"] },
    },
  },
  allIds: ["reference", "content", "year", "pages", "remarks"],
};

export const HEADERS_STRATIGRAPHY_SYNONYM: Headers = {
  byIds: {
    synonym: {
      title: "stratigraphySynonym.synonym",
      value: "synonym",
      show: true,
      apiFieldValue: "synonym",
      sortField: ["synonym"],
    },
    language: {
      title: "stratigraphySynonym.language",
      value: "language",
      show: true,
      apiFieldValue: { et: "language__value", en: "language__value_en" },
      sortField: { et: ["language__value"], en: ["language__value_en"] },
    },
    reference: {
      title: "stratigraphySynonym.reference",
      value: "reference",
      show: true,
      apiFieldValue: "reference__reference",
      sortField: ["reference__reference"],
    },
    remarks: {
      title: "stratigraphySynonym.remarks",
      value: "remarks",
      show: true,
      apiFieldValue: "remarks",
      sortField: ["remarks"],
    },
  },
  allIds: ["synonym", "language", "reference", "remarks"],
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

export const HEADERS_TAXON: Headers = {
  byIds: {
    id: {
      title: "taxon.id",
      value: "id",
      show: false,
      apiFieldValue: "id",
      sortField: ["id"],
      ...narrowColumn,
    },
    taxon: {
      title: "taxon.taxon",
      value: "taxon",
      show: true,
      apiFieldValue: "taxon",
      sortField: ["taxon"],
      ...ultraWideColumn,
    },
    parent_taxon: {
      title: "taxon.parentTaxon",
      value: "parent_taxon",
      show: true,
      apiFieldValue: "parent_taxon",
      sortField: ["parent_taxon"],
      ...wideColumn,
    },
    fossil_group: {
      title: "taxon.fossilGroup",
      value: "fossil_group",
      show: true,
      apiFieldValue: "fossil_group",
      sortField: ["fossil_group"],
      ...wideColumn,
    },
    fad: {
      title: "taxon.fad",
      value: "fad",
      show: true,
      apiFieldValue: { et: "fad_stratigraphy", en: "fad_stratigraphy_en" },
      sortField: { et: ["fad_stratigraphy"], en: ["fad_stratigraphy_en"] },
      ...normalColumn,
    },
    lad: {
      title: "taxon.lad",
      value: "lad",
      show: true,
      apiFieldValue: { et: "lad_stratigraphy", en: "lad_stratigraphy_en" },
      sortField: { et: ["lad_stratigraphy"], en: ["lad_stratigraphy_en"] },
      ...normalColumn,
    },
    in_estonia: {
      title: "taxon.inEstonia",
      value: "in_estonia",
      show: true,
      apiFieldValue: "in_estonia",
      sortField: ["in_estonia"],
      ...narrowColumn,
    },
    is_fossil: {
      title: "taxon.isFossil",
      value: "is_fossil",
      show: true,
      apiFieldValue: "is_fossil",
      sortField: ["is_fossil"],
      ...narrowColumn,
    },
    is_valid: {
      title: "taxon.isValid",
      value: "is_valid",
      show: true,
      apiFieldValue: "is_valid",
      sortField: ["is_valid"],
      ...narrowColumn,
    },
  },
  allIds: ["id", "taxon", "parent_taxon", "fossil_group", "fad", "lad", "in_estonia", "is_fossil", "is_valid"],
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
