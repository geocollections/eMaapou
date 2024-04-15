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
    .filter(sortItem => sortItem.order)
    .map((sortItem) => {
      const sortKey = sortItem.key;
      const column = findHeaderColumn(headersMap, sortKey);

      if (Array.isArray(column.sortField)) {
        return column.sortField
          .map((field) => {
            return `${sortItem.order === "asc" ? "" : "-"}${field}`;
          })
          .join(",");
      }
      else if (typeof column.sortField === "object") {
        const fields = column.sortField[locale];
        return fields.map((field) => {
          return `${sortItem.order === "asc" ? "" : "-"}${field}`;
        }).join(",");
      }
      return `${sortItem.order === "asc" ? "" : "-"}${column.value}`;
    })
    .join(",");
}

function findHeaderColumn(headersMap: { [K: string]: Header }, sortKey: string) {
  if (headersMap[sortKey])
    return headersMap[sortKey];

  const headersWithChildren = Object.values(headersMap).filter((header) => {
    return header.children && header.children.length > 0;
  });

  for (const header of headersWithChildren) {
    for (const child of header.children) {
      if (child.value === sortKey)
        return child;
    }
  }
}
