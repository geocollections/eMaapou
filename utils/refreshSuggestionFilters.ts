export function refreshSuggestionFilters<T extends { [K: string]: (() => void) | undefined }>(suggestionRefreshMap: T, excludeKey?: keyof T) {
  const refreshables = Object.entries(suggestionRefreshMap).filter(
    ([k]) => k !== excludeKey,
  ).map(([, v]) => v);

  refreshables.forEach((refresh) => {
    if (!refresh)
      return;
    refresh();
  });
}
