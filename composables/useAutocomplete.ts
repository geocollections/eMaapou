import type { Suggestion } from "~/components/filter/input/FilterInputAutocomplete.vue";

export const useAutocomplete = (
  path: string,
  {
    nameField,
    idField,
    filterExclude,
    solrParams,
    containsParser,
    primary = "id",
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
) => {
  const { locale } = useI18n();
  const { $solrFetch } = useNuxtApp();

  const translatedNameField = computed(() => {
    if (typeof nameField === "string") {
      return nameField;
    }
    return nameField[locale.value];
  });

  const primaryField = computed(() => {
    if (primary === "id") {
      return idField;
    }
    return translatedNameField.value;
  });

  const secoundaryField = computed(() => {
    if (primary === "id") {
      return translatedNameField.value;
    }
    return idField;
  });

  const suggestionsPivot = computed(() => {
    return `${primaryField.value},${secoundaryField.value}`;
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
      name: item.pivot[0].value,
      count: item.count,
    };
  }

  const suggestMapper = computed(() => {
    if (primary === "id") {
      return primaryFieldIdMapper;
    }
    return primaryFieldNameMapper;
  });

  function parseContains(query: string) {
    if (containsParser) {
      return containsParser(query);
    }
    return query;
  }

  async function suggest({
    query,
    pagination,
    values,
  }: {
    query: string;
    pagination: { page: number; perPage: number };
    values: string[];
  }): Promise<Suggestion[]> {
    const pivot = filterExclude
      ? `{!ex=${filterExclude}}${suggestionsPivot.value}`
      : `${suggestionsPivot.value}`;
    const filters =
      query.length > 0
        ? [
            ...(solrParams?.filter?.value ?? []),
            `${translatedNameField.value}:*${query}*`,
          ]
        : solrParams?.filter?.value ?? [];

    const res = await $solrFetch(path, {
      query: {
        facet: "true",
        "facet.pivot": pivot,
        // [`f.${primaryField.value}.facet.contains`]: parseContains(query),
        // [`f.${primaryField.value}.facet.contains.ignoreCase`]: true,
        [`f.${primaryField.value}.facet.excludeTerms`]: values.join(","),
        "facet.limit": pagination.perPage,
        "facet.sort": "count",
        [`f.${primaryField.value}.facet.offset`]:
          (pagination.page - 1) * pagination.perPage,
        json: {
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
    }, {});

    const res = await $solrFetch(path, {
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

    return values.map((id) => ({
      id,
      name: res.facets[id].name.buckets[0].val,
      count: res.facets[id].count,
    }));
  }

  return { suggest, hydrate };
};
