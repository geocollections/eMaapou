import { z } from "zod";
import type { DataTableOptions, Headers, SortItem } from "~/constants";

export function useDataTable({ initOptions, initHeaders }: { initOptions: DataTableOptions; initHeaders: Headers }) {
  const options = ref(initOptions);

  const { headers, handleHeadersReset, handleHeadersChange, addHeaders } = useHeaders(initHeaders);

  const { locale } = useI18n();
  const solrSort = computed(() => {
    return getSolrSort({
      sortBy: options.value.sortBy,
      headersMap: initHeaders.byIds,
      locale: locale.value as "et" | "en",
    });
  });
  const routeQueryOptionsSchema = z.object({
    page: z
      .string()
      .transform(val => Number.parseInt(val))
      .refine(val => val > 0)
      .catch(1),
    itemsPerPage: z
      .string()
      .transform(val => Number.parseInt(val))
      .refine(val => val > 0)
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
              key: key!,
              order: order as "asc" | "desc",
            };
          });
      })
      .catch([]),
  });

  const stateToQueryParamsSchema = z.object({
    page: z.number().transform(val => (val > 1 ? val.toString() : undefined)),
    itemsPerPage: z
      .number()
      .transform(val => (val !== 25 ? val.toString() : undefined)),
    sortBy: z
      .object({ key: z.string(), order: z.string().optional() })
      .array()
      .transform((val) => {
        return val.length > 0
          ? val.map(v => `${v.key} ${v.order}`).join(",")
          : undefined;
      }),
  });

  const query = ref("");
  const solrQuery = computed(() => {
    return query.value.length > 0 ? query.value : "*";
  });

  function handleUpdate(tableState: { options: DataTableOptions; search: string }) {
    options.value = tableState.options;
    query.value = tableState.search;
  }

  function reset() {
    query.value = "";
    options.value.page = 1;
  }

  return {
    options,
    headers,
    query,
    solrQuery,
    handleUpdate,
    handleHeadersReset,
    handleHeadersChange,
    addHeaders,
    solrSort,
    routeQueryOptionsSchema,
    stateToQueryParamsSchema,
    reset,
  };
}

export function useDataTableGeoloogiaApi({ initOptions, initHeaders }: { initOptions: DataTableOptions; initHeaders: Headers }) {
  const options = ref(initOptions);

  const { headers, handleHeadersReset, handleHeadersChange, addHeaders } = useHeaders(initHeaders);

  const { locale } = useI18n();
  const sortBy = computed(() => {
    return getGeoloogiaApiSort({
      sortBy: options.value.sortBy,
      headersMap: initHeaders.byIds,
      locale: locale.value as "et" | "en",
    });
  });

  const routeQueryOptionsSchema = z.object({
    page: z
      .string()
      .transform(val => Number.parseInt(val))
      .refine(val => val > 0)
      .catch(1),
    itemsPerPage: z
      .string()
      .transform(val => Number.parseInt(val))
      .refine(val => val > 0)
      .catch(25),
    sortBy: z
      .string()
      .transform((val): SortItem[] => {
        const sortStrings = val.split(",");
        return sortStrings
          .filter((sortString) => {
            const [_key, order] = sortString.split(" ", 2);
            return order === "asc" || order === "desc";
          })
          .map((sortString): SortItem => {
            const [key, order] = sortString.split(" ", 2);

            return {
              key: key!,
              order: order as "asc" | "desc",
            };
          });
      })
      .catch([]),
  });

  const stateToQueryParamsSchema = z.object({
    page: z.number().transform(val => (val > 1 ? val.toString() : undefined)),
    itemsPerPage: z
      .number()
      .transform(val => (val !== 25 ? val.toString() : undefined)),
    sortBy: z
      .object({ key: z.string(), order: z.string().optional() })
      .array()
      .transform((val) => {
        return val.length > 0
          ? val.map(v => `${v.key} ${v.order}`).join(",")
          : undefined;
      }),
  });

  const query = ref("");
  const searchParams = computed(() => {
    if (query.value.length < 1)
      return undefined;

    return {
      search: query.value,
      search_fields: Object.values(getAPIFieldValues(initHeaders, locale.value as "et" | "en")).join(","),
    };
  });

  function handleUpdate(tableState: { options: DataTableOptions; search: string }) {
    options.value = tableState.options;
    query.value = tableState.search;
  }

  function reset() {
    query.value = "";
    options.value.page = 1;
  }

  return {
    options,
    headers,
    query,
    searchParams,
    handleUpdate,
    handleHeadersReset,
    handleHeadersChange,
    addHeaders,
    sortBy,
    routeQueryOptionsSchema,
    stateToQueryParamsSchema,
    reset,
  };
}
