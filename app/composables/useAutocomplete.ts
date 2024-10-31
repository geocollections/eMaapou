import type { Suggestion } from "~/components/filter/input/FilterInputAutocomplete.vue";

export function useAutocomplete(
  path: string,
  {
    nameField,
    idField,
    filterExclude,
    solrParams,
    containsParser,
    primary = "name",
  }: {
    nameField: string | { et: string; en: string };
    idField: string;
    filterExclude?: string;
    solrParams?: {
      query?: Ref<string>;
      filter?: Ref<(string | { [K: string]: string })[]>;
    };
    primary?: "id" | "name";
    containsParser?: (query: string) => string;
  },
) {
  const { locale } = useI18n();
  const { $solrFetch } = useNuxtApp();

  const translatedNameField = computed(() => {
    if (typeof nameField === "string")
      return nameField;

    return nameField[locale.value as "et" | "en"];
  });

  const primaryField = computed(() => {
    if (primary === "id")
      return idField;

    return translatedNameField.value;
  });

  const secondaryField = computed(() => {
    if (primary === "id")
      return translatedNameField.value;

    return idField;
  });

  const suggestionsPivot = computed(() => {
    return `${primaryField.value},${secondaryField.value}`;
  });

  function primaryFieldNameMapper(item: any) {
    return {
      id: item.pivot[0].value,
      name: item.value,
      count: item.count,
    };
  }

  function primaryFieldIdMapper(item: any) {
    return {
      id: item.value,
      name: item.pivot?.[0].value ?? item.value,
      count: item.count,
    };
  }

  const suggestMapper = computed(() => {
    if (primary === "id")
      return primaryFieldIdMapper;

    return primaryFieldNameMapper;
  });

  function parseContains(query: string) {
    if (containsParser)
      return containsParser(query);

    return query;
  }

  async function suggest({
    query,
    pagination,
    // eslint-disable-next-line unused-imports/no-unused-vars
    values,
  }: {
    query: string;
    pagination: { page: number; perPage: number };
    values: string[];
  }): Promise<Suggestion[]> {
    const pivot = filterExclude
      ? `{!ex=${filterExclude}}${suggestionsPivot.value}`
      : `${suggestionsPivot.value}`;
    const filters = solrParams?.filter?.value ?? [];

    const res = await $solrFetch<any>(path, {
      query: {
        "facet": "true",
        "facet.pivot": pivot,
        [`f.${primaryField.value}.facet.contains`]: parseContains(query),
        [`f.${primaryField.value}.facet.contains.ignoreCase`]: true,
        "facet.limit": pagination.perPage,
        "facet.sort": "count",
        [`f.${primaryField.value}.facet.offset`]:
          (pagination.page - 1) * pagination.perPage,
        "json": {
          query: solrParams?.query?.value,
          filter: filters,
          limit: 0,
        },
      },
    });
    return res.facet_counts.facet_pivot[suggestionsPivot.value].map(
      suggestMapper.value,
    );
  }

  async function hydrate(values: string[]): Promise<Suggestion[]> {
    const facets = values.reduce((prev, id) => {
      prev[id] = {
        type: "query",
        q: `${idField}:${id}`,
        facet: {
          name: {
            type: "terms",
            field: translatedNameField.value,
            limit: 1,
            domain: {
              query: "*:*",
              filter: `${idField}:${id}`,
            },
          },
        },
      };
      return prev;
    }, {} as { [K: string]: any });

    const res = await $solrFetch<any>(path, {
      query: {
        json: {
          limit: 0,
          query: solrParams?.query?.value,
          filter: solrParams?.filter?.value,
          facet: {
            ...facets,
          },
        },
      },
    });

    return values.map(id => ({
      id,
      name: res.facets[id].name.buckets[0].val,
      count: res.facets[id].count,
    }));
  }

  return { suggest, hydrate };
}

export function useAutocompleteReference(
  path: string,
  {
    field,
    filterExclude,
    solrParams,
    containsParser,
  }: {
    field: string;
    filterExclude?: string;
    solrParams?: {
      query?: Ref<string>;
      filter?: Ref<(string | { [K: string]: string })[]>;
    };
    primary?: "id" | "name";
    containsParser?: (query: string) => string;
  },
) {
  const { $solrFetch } = useNuxtApp();

  const suggestionsPivot = computed(() => {
    return `${field}`;
  });

  function fieldMapper(item: any) {
    return {
      id: item.value.split("/")[1] ?? item.value,
      name: item.value.split("/")[0] ?? item.value,
      count: item.count,
    };
  }

  const suggestMapper = computed(() => {
    return fieldMapper;
  });

  function parseContains(query: string) {
    if (containsParser)
      return containsParser(query);

    return query;
  }

  async function suggest({
    query,
    pagination,
    // eslint-disable-next-line unused-imports/no-unused-vars
    values,
  }: {
    query: string;
    pagination: { page: number; perPage: number };
    values: string[];
  }): Promise<Suggestion[]> {
    const pivot = filterExclude
      ? `{!ex=${filterExclude}}${suggestionsPivot.value}`
      : `${suggestionsPivot.value}`;
    const filters = solrParams?.filter?.value ?? [];

    const res = await $solrFetch<any>(path, {
      query: {
        "facet": "true",
        "facet.pivot": pivot,
        [`f.${field}.facet.contains`]: parseContains(query),
        [`f.${field}.facet.contains.ignoreCase`]: true,
        // [`f.${primaryField.value}.facet.excludeTerms`]: values.join(","),
        "facet.limit": pagination.perPage,
        "facet.sort": "count",
        [`f.${field}.facet.offset`]:
          (pagination.page - 1) * pagination.perPage,
        "json": {
          query: solrParams?.query?.value,
          filter: filters,
          limit: 0,
        },
      },
    });
    return res.facet_counts.facet_pivot[suggestionsPivot.value].map(
      suggestMapper.value,
    );
  }

  async function hydrate(values: string[]): Promise<Suggestion[]> {
    const facets = values.reduce((prev, id) => {
      prev[id] = {
        type: "query",
        q: `${field}:*${id}`,
        facet: {
          name: {
            type: "terms",
            field,
            limit: 1,
            domain: {
              query: "*:*",
              filter: `${field}:*${id}`,
            },
          },
        },
      };
      return prev;
    }, {} as { [K: string]: any });

    const res = await $solrFetch<any>(path, {
      query: {
        json: {
          limit: 0,
          query: solrParams?.query?.value,
          filter: solrParams?.filter?.value,
          facet: {
            ...facets,
          },
        },
      },
    });

    return values.map(id => ({
      id,
      name: res.facets[id].name.buckets[0].val.split("/")[0] ?? res.facets[id].name.buckets[0].val,
      count: res.facets[id].count,
    }));
  }

  return { suggest, hydrate };
}
