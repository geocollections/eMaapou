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
