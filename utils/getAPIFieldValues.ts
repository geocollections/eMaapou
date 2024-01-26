export default function (
  headers: {
    byIds: { [key: string]: any };
    allIds: string[];
  },
  locale: string
): { [key: string]: string } {
  return Object.entries(headers.byIds)
    .filter(([_, header]) => {
      return header.apiFieldValue;
    })
    .reduce((o, [headerKey, header]) => {
      let apiFieldValue = "";
      if (typeof header.apiFieldValue === "string")
        apiFieldValue = header.apiFieldValue;
      if (typeof header.apiFieldValue === "object")
        apiFieldValue = header.apiFieldValue[locale];

      return {
        ...o,
        [headerKey]: apiFieldValue,
      };
    }, {});
}
