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
  if (sortBy.length === 0) return undefined;
  return sortBy
    .filter((sortItem) => sortItem.order)
    .map((sortItem) => {
      let sortField = sortItem.key;
      if (typeof headersMap[sortItem.key].apiFieldValue === "string") {
        sortField = headersMap[sortItem.key].apiFieldValue as string;
      } else if (typeof headersMap[sortItem.key].apiFieldValue === "object") {
        sortField = (
          headersMap[sortItem.key].apiFieldValue as { et: string; en: string }
        )[locale] as string;
      }

      if (typeof sortItem.order === "boolean") {
        if (sortItem.order) return sortField;
        return `-${sortField}`;
      }
      if (sortItem.order === "asc") return sortField;
      if (sortItem.order === "desc") return `-${sortField}`;
    })
    .join(",");
}
