export function findHeaderColumn(headersMap: { [K: string]: Header }, key: string): Header | ChildHeader | undefined {
  if (headersMap[key])
    return headersMap[key];

  const headersWithChildren = Object.values(headersMap).filter((header) => {
    return header.children && header.children.length > 0;
  });

  for (const header of headersWithChildren) {
    for (const child of header.children!) {
      if (child.value === key)
        return child;
    }
  }
}
