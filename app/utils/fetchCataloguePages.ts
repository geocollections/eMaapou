export async function fetchCataloguePages<T>(readPage: (offset: number) => Promise<{ results: T[]; count: number }>): Promise<T[]> {
  const results: T[] = [];
  while (true) {
    const page = await readPage(results.length);
    results.push(...page.results);
    if (!page.results.length || results.length >= page.count)
      return results;
  }
}
