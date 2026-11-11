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

export interface NewsArticle {
  id: number;
  title_et: string | null;
  title_en: string | null;
  text_et: string | null;
  text_en: string | null;
  date_published: string | null;
  date_added: string;
}
