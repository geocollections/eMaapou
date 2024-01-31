import { z } from "zod";
import type { SortItem } from "~/constants";

export function useDataTable({ initOptions, initHeaders }) {
  const options = ref(initOptions);

  const { headers, handleHeadersReset, handleHeadersChange } =
    useHeaders(initHeaders);

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
      .transform((val) => parseInt(val))
      .refine((val) => val > 0)
      .catch(1),
    itemsPerPage: z
      .string()
      .transform((val) => parseInt(val))
      .refine((val) => val > 0)
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
              key,
              order: order as "asc" | "desc",
            };
          });
      })
      .catch([]),
  });

  const stateToQueryParamsSchema = z.object({
    page: z.number().transform((val) => (val > 1 ? val.toString() : undefined)),
    itemsPerPage: z
      .number()
      .transform((val) => (val !== 25 ? val.toString() : undefined)),
    sortBy: z
      .object({ key: z.string(), order: z.string().optional() })
      .array()
      .transform((val) =>
        val.length > 0
          ? val.map((v) => `${v.key} ${v.order}`).join(",")
          : undefined,
      ),
  });

  const query = ref("");
  const solrQuery = computed(() => {
    return query.value.length > 0 ? query.value : "*";
  });

  function handleUpdate(tableState) {
    options.value = tableState.options;
    query.value = tableState.search;
  }
  return {
    options,
    headers,
    query,
    solrQuery,
    handleUpdate,
    handleHeadersReset,
    handleHeadersChange,
    solrSort,
    routeQueryOptionsSchema,
    stateToQueryParamsSchema,
  };
}
export function useDataTableDetail({ initOptions, initHeaders }) {
  const options = ref(initOptions);

  const { headers, handleHeadersReset, handleHeadersChange } =
    useHeaders(initHeaders);
  const search = ref("");

  const solrQuery = computed(() => {
    return search.value.length > 0 ? search.value : "*";
  });

  function handleUpdate(tableState) {
    options.value = tableState.options;
    search.value = tableState.search;
  }
  return {
    options,
    headers,
    search,
    solrQuery,
    handleUpdate,
    handleHeadersReset,
    handleHeadersChange,
  };
}
