import type { DataTableOptions } from "~/constants";
import type { Header } from "~/constants/headersNew";

export default function ({
  sortBy,
  headersMap,
  locale,
}: {
  sortBy: DataTableOptions["sortBy"];
  headersMap: { [K: string]: Header };
  locale: "et" | "en";
}) {
  if (sortBy.length === 0) return undefined;
  return sortBy
    .filter(
      (sortItem): sortItem is Required<typeof sortItem> => !!sortItem.order,
    )
    .map((sortItem) => {
      const sortKey = sortItem.key;
      const column = headersMap[sortKey];

      if (column.sortField instanceof Array) {
        return column.sortField
          .map((field) => {
            return `${field} ${sortItem.order === "asc" ? "asc" : "desc"}`;
          })
          .join(",");
      } else if (typeof column.sortField === "object") {
        return `${column.sortField[locale] ?? column.sortField["et"]} ${
          sortItem.order === "asc" ? "asc" : "desc"
        }`;
      }
      return `${column.apiFieldValue ?? column.value} ${
        sortItem.order === "asc" ? "asc" : "desc"
      }`;
    })
    .join(",");
}
