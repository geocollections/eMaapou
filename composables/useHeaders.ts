import cloneDeep from "lodash/cloneDeep";
import type { DataTableOptions, Header, Headers } from "~/constants";

export function useHeadersNew(initHeaders: Headers) {
  const { t } = useI18n();

  const headersMap = ref(cloneDeep(initHeaders));

  const translateHeader = (header: Header) => {
    if (header.titleTranslate === undefined || header.titleTranslate === true)
      return t(header.title);

    return header.title;
  };

  const headers = computed(() => {
    return headersMap.value.allIds.map((id: string) => {
      const header = headersMap.value.byIds[id];
      return {
        ...header,
        sortable: header.sortable !== undefined ? header.sortable : true,
        title: translateHeader(header),
        children: header.children?.map((child) => {
          return {
            ...child,
            title: translateHeader(child),
          };
        }),
      };
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
}
