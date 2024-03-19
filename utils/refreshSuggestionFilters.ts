export function refreshSuggestionFilters(suggestionRefreshMap: { [K: string]: (() => void) | undefined }, excludeKey?: string) {
  const refreshables = Object.entries(suggestionRefreshMap).filter(
    ([k]) => k !== excludeKey,
  ).map(([, v]) => v);

  refreshables.forEach((refresh) => {
    if (!refresh)
      return;
    refresh();
  });
}
