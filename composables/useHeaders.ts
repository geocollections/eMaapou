import cloneDeep from "lodash/cloneDeep";
import type { Headers, Header, DataTableOptions } from "~/constants";
import type {
  Headers as HeadersNew,
  Header as HeaderNew,
} from "~/constants/headersNew";

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
      return {
        ...header,
        sortable: header.sortable !== undefined ? header.sortable : true,
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
};

export const useHeadersNew = (initHeaders: HeadersNew) => {
  const { t } = useI18n();

  const headersMap = ref(cloneDeep(initHeaders));

  const translateHeader = (header: HeaderNew) => {
    if (header.titleTranslate === undefined || header.titleTranslate === true) {
      return t(header.title);
    }
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
};
