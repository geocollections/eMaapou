import cloneDeep from "lodash/cloneDeep";
import type { Headers, Header, DataTableOptions } from "~/constants";

export const useHeaders = (initHeaders: Headers) => {
  const { t } = useI18n();

  const headersMap = ref(cloneDeep(initHeaders));

  const translateHeader = (header: Header) => {
    if (header.translate === undefined || header.translate === true) {
      header.title = t(header.text).toString();
    }
    return header;
  };

  const headers = computed(() => {
    return headersMap.value.allIds.map((id: string) => {
      const header = translateHeader(headersMap.value.byIds[id]);
      return { ...header, sortable: header.sortable ? header.sortable : true };
    });
  });

  const handleHeadersChange = (e: string) => {
    headersMap.value.byIds[e].show = !headersMap.value.byIds[e].show;
  };
  const handleHeadersReset = (options: DataTableOptions) => {
    headersMap.value = cloneDeep(initHeaders);
    options.sortBy?.forEach((sortItem) => {
      headersMap.value.byIds[sortItem.key].show = true;
    });
  };
  return { headers, handleHeadersChange, handleHeadersReset };
};
