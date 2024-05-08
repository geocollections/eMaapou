export interface GeoloogiaListResponse<T = any> {
  count: number;
  results: T[];
  next: string | null;
  previous: string | null;
}

export interface SolrResponse<T = any> {
  response: {
    numFound: number;
    start: number;
    docs: T[];
  };
}
