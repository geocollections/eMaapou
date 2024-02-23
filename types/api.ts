export interface GeoloogiaListResponse<T = any> {
  count: number;
  results: T[];
}

export interface SolrResponse<T = any> {
  response: {
    numFound: number;
    start: number;
    docs: T[];
  };
}
