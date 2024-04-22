import { utils, writeFileXLSX } from "xlsx";

export type ExportType = "csv" | "xlsx";
export type ExportSelection = "all" | "page";

export interface ExportFunc {
  ({ type, filename, selection }: { type: ExportType; rows: number; filename: string; selection: ExportSelection }): Promise<void>;
};

export function useExportSolr(path: string, { params, totalRows }: {
  params: {
    query?: Ref<string>;
    filter?: Ref<(string | { [K: string]: string })[]>;
    sort?: Ref<string | undefined>;
    limit?: Ref<number>;
    offset?: Ref<number>;
    fields?: string[];
  };
  totalRows: Ref<number>;
}) {
  const { $solrFetch } = useNuxtApp();

  const exportData: ExportFunc = async ({ type, filename, selection }) => {
    const data = await $solrFetch<string>(path, {
      query: {
        json: {
          query: params.query?.value,
          filter: params.filter?.value,
          fields: params.fields,
          ...getSelectionParams(selection),
        },
        wt: type,
      },
    });

    if (type === "csv") {
      const label = `${filename}.${type}`;
      const blob = new Blob([data], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = label;
      link.click();
      URL.revokeObjectURL(link.href);
    }
  };

  function getSelectionParams(selection: ExportSelection) {
    if (selection === "all") {
      return {
        limit: totalRows.value > 10000 ? 10000 : totalRows.value,
      };
    }
    return {
      limit: params.limit?.value,
      offset: params.offset?.value,
    };
  }

  return { exportData };
}
