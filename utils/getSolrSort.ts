// import type { DataTableOptions, Header } from "~/constants";
//
// export default function ({
//   sortBy,
//   headersMap,
//   locale,
// }: {
//   sortBy: DataTableOptions["sortBy"];
//   headersMap: { [K: string]: Header };
//   locale: "et" | "en";
// }) {
//   if (sortBy.length === 0)
//     return undefined;
//   return sortBy
//     .filter(
//       (sortItem): sortItem is Required<typeof sortItem> => !!sortItem.order,
//     )
//     .map((sortItem) => {
//       const sortKey = sortItem.key;
//       const column = findHeaderColumn(headersMap, sortKey);
//
//       if (!column)
//         return undefined;
//       if (!column.sortField)
//         return undefined;
//
//       if (Array.isArray(column.sortField)) {
//         return column.sortField
//           .map((field) => {
//             return solrSortString(field, sortItem.order);
//           })
//           .join(",");
//       }
//
//       const fields = column.sortField[locale];
//       return fields.map((field) => {
//         return solrSortString(field, sortItem.order);
//       }).join(",");
//     })
//     .filter(sortString => !!sortString)
//     .join(",");
// }
//
// function solrSortString(field: string, order: boolean | "asc" | "desc") {
//   if (typeof order === "boolean")
//     return `${field} ${order ? "asc" : "desc"}`;
//   return `${field} ${order}`;
// }
