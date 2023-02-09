export default ({
  query,
  category,
  resultsCount,
}: {
  query: string
  category?: string | boolean
  resultsCount?: number | boolean
}) => {
  if (typeof window === 'undefined') return

  const categoryValue = category ?? false
  const resultsCountValue = resultsCount ?? false
  window._paq.push(['trackSiteSearch', query, categoryValue, resultsCountValue])
}
