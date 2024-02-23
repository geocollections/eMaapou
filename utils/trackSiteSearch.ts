export default ({
  query,
  category,
  resultsCount,
}: {
  query: string;
  category?: string | boolean;
  resultsCount?: number | boolean;
}) => {
  if (typeof window === "undefined")
    return;
  if (!window._paq)
    return;

  const categoryValue = category ?? false;
  const resultsCountValue = resultsCount ?? false;

  (window._paq as any[]).push(["trackSiteSearch", query, categoryValue, resultsCountValue]);
};
