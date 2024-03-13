import type { DataTableOptions, Header } from "~/constants";

export default function ({
  sortBy,
  headersMap,
  locale,
}: {
  sortBy: DataTableOptions["sortBy"];
  headersMap: { [K: string]: Header };
  locale: "et" | "en";
}) {
  if (sortBy.length === 0)
    return undefined;
  return sortBy
    .filter(
      (sortItem): sortItem is Required<typeof sortItem> => !!sortItem.order,
    )
    .map((sortItem) => {
      const sortKey = sortItem.key;
      const column = headersMap[sortKey];

      if (Array.isArray(column.sortField)) {
        return column.sortField
          .map((field) => {
            return `${field} ${sortItem.order === "asc" ? "asc" : "desc"}`;
          })
          .join(",");
      }
      else if (typeof column.sortField === "object") {
        const fields = column.sortField[locale];
        return fields.map((field) => {
          return `${field} ${sortItem.order === "asc" ? "asc" : "desc"}`;
        }).join(",");
      }
      return `${column.value as string} ${sortItem.order === "asc" ? "asc" : "desc"}`;
    })
    .join(",");
}
