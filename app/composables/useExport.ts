export type ExportType = "csv" | "xlsx";
export type ExportSelection = "all" | "page";

export interface ExportFunc {
  ({ type, filename, selection }: { type: ExportType; filename: string; selection: ExportSelection }): Promise<void>;
};

export function useExportSolr(path: string, { query, totalRows }: {
  query: Ref<{
    query?: string;
    filter?: string | (string | { [K: string]: string })[];
    sort?: string | undefined;
    limit?: number;
    offset?: number;
    fields?: string[];
  }>;
  totalRows: Ref<number>;
}) {
  const { $solrFetch } = useNuxtApp();

  const exportData: ExportFunc = async ({ type, filename, selection }) => {
    const data = await $solrFetch<Blob>(path, {
      responseType: "blob",
      query: {
        json: {
          query: query.value.query,
          filter: query.value.filter,
          sort: query.value.sort,
          fields: query.value.fields,
          ...getSelectionParams(selection),
        },
        wt: type,
      },
    });
    if (type === "xlsx") {
      const signature = new Uint8Array(await data.slice(0, 2).arrayBuffer());
      if (signature[0] !== 0x50 || signature[1] !== 0x4B)
        throw new Error("The data service did not return an XLSX workbook.");
    }
    const link = document.createElement("a");
    const url = URL.createObjectURL(data);
    link.href = url;
    link.download = `${filename}.${type}`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const maxRows = 10000;

  function getSelectionParams(selection: ExportSelection) {
    if (selection === "all") {
      return {
        limit: totalRows.value > maxRows
          ? maxRows
          : totalRows.value,
      };
    }
    const limit = (query.value.limit ?? 25) > totalRows.value
      ? totalRows.value
      : query.value.limit;
    return {
      limit,
      offset: query.value.offset,
    };
  }

  return { exportData };
}

interface GeoloogiaApiQuery {
  limit?: number;
  offset?: number;
  [K: string]: any;
}

export function useExportApi(path: string, { query, totalRows }: {
  query: Ref<GeoloogiaApiQuery>;
  totalRows: Ref<number>;
}) {
  const { $apiFetch } = useNuxtApp();

  const exportData: ExportFunc = async ({ type, filename, selection }) => {
    const data = await $apiFetch<string>(path, {
      query: {
        ...query.value,
        ...getSelectionParams(selection),
        format: type,
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
    else if (type === "xlsx") {
      const label = `${filename}.${type}`;
      const blob = new Blob([data], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = label;
      link.click();
      URL.revokeObjectURL(link.href);
    }
  };

  const maxRows = 1000;

  function getSelectionParams(selection: ExportSelection) {
    if (selection === "all") {
      return {
        limit: totalRows.value > maxRows
          ? maxRows
          : totalRows.value,
      };
    }
    const limit = (query.value.limit ?? 25) > totalRows.value
      ? totalRows.value
      : query.value.limit;
    return {
      limit,
      offset: query.value.offset,
    };
  }

  return { exportData };
}
