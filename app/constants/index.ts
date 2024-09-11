import type { VDataTable } from "vuetify/components";

export * from "./browse";
export * from "./chart";
export * from "./fields";
export * from "./headers";
export * from "./services";

export type SortItem = InstanceType<typeof VDataTable>["sortBy"][0];

export interface DataTableOptions {
  page: number;
  itemsPerPage: number;
  sortBy: SortItem[];
}

interface ResourceDefaults {
  options: DataTableOptions;
}

export const ANALYSIS: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
  },
};

export const ANALYTICAL_DATA: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
  },
};

export const AREA: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
  },
};

export const DATASET_ANALYSIS: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
  },
};

export const ATTACHMENT: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
  },
};

export const ATTACHMENT_LINK: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
  },
};

export const DATASET_AUTHORS: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
  },
};

export const DATASET_GEOLOCATIONS: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
  },
};

export const FOSSILS: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
  },
};

export const IMAGE: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [{ key: "id", order: "desc" }],
  },
};

export const SAMPLE: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
  },
};

export const SPECIMEN: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
  },
};

export const LOCALITY_REFERENCE: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
  },
};

export const DATASET_REFERENCE: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
  },
};

export const STRATIGRAPHY_REFERENCE: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [{ key: "year", order: "desc" }],
  },
};

export const SAMPLE_REFERENCE: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
  },
};

export const SITE: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
  },
};

export const PREPARATION: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
  },
};

export const LOCALITY: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
  },
};

export const DRILLCORE: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
  },
};

export const STRATOTYPE: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [
      { key: "depthFrom", order: "asc" },
      { key: "depthTo", order: "desc" },
    ],
  },
};

export const SYNONYM: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
  },
};
export const STRATIGRAPHY_SYNONYM: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
  },
};

export const DESCRIPTION: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [
      { key: "depthFrom", order: "asc" },
      { key: "depthTo", order: "desc" },
    ],
  },
};

export const TAXON_LIST: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
  },
};

export const TAXON: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
  },
};

export const ANALYSIS_RESULT: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
  },
};

export const ROCK: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
  },
};

export const DOI: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
  },
};

export const DATASET: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
  },
};

export const REFERENCE: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
  },
};

export const STRATIGRAPHY: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
  },
};

export const SPECIMEN_IDENTIFICATION: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
  },
};

export const SPECIMEN_IDENTIFICATION_GEOLOGY: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
  },
};

export const SPECIMEN_REFERENCE: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
  },
};

export const SAMPLE_DATA: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
  },
};
