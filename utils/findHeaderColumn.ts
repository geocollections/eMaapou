export function findHeaderColumn(headersMap: { [K: string]: Header }, sortKey: string): Header | ChildHeader | undefined {
  if (headersMap[sortKey])
    return headersMap[sortKey];

  const headersWithChildren = Object.values(headersMap).filter((header) => {
    return header.children && header.children.length > 0;
  });

  for (const header of headersWithChildren) {
    for (const child of header.children!) {
      if (child.value === sortKey)
        return child;
    }
  }
}
