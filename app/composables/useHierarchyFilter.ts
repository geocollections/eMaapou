import type { TreeNode } from "~/components/filter/input/FilterInputHierarchy.vue";

export function useStratigraphyHierarchyFilter(
  path: string,
  {
    filterExclude,
    solrParams,
    filter,
  }: {
    filterExclude?: string;
    solrParams: {
      query: Ref<string>;
      filter: Ref<(string | { [K: string]: string })[]>;
    };
    filter: StringIdListFilter;
  },
) {
  const { $solrFetch } = useNuxtApp();

  async function hydrate(values: string[]) {
    if (values.length < 1)
      return [];

    const res = await $solrFetch<any>("/stratigraphy", {
      query: {
        q: "*",
        fq: [`hierarchy_string:(${values.join(" ")})`],
        limit: values.length,
      },
    });
    const facetQueries = res.response.docs.reduce((prev: { [K: string]: { type: string; q: string } }, doc: any) => {
      prev[doc.id] = {
        type: "query",
        q: `stratigraphy_hierarchy_descendent_paths:${doc.hierarchy_string}`,
      };
      return prev;
    }, {} as { [K: string]: { type: string; q: string } });

    const countRes = await $solrFetch<any>(path, {
      query: {
        json: {
          limit: 0,
          query: solrParams.query.value,
          filter: solrParams.filter.value,
          facet: facetQueries,
        },
      },
    });

    return res.response.docs.map((doc: any) => ({
      id: doc.id,
      name: { et: doc.stratigraphy, en: doc.stratigraphy_en },
      value: doc.hierarchy_string,
      count: countRes.facets[doc.id]?.count ?? 0,
    }));
  }

  async function getChildren(value: string, { page, perPage }: { page: number; perPage: number }): Promise<[TreeNode[], number]> {
    const depth = value.split("-").length;
    const prefix = `${depth}/${value}`;

    const countRes = await $solrFetch<any>(path, {
      query: {
        json: {
          limit: 0,
          query: solrParams?.query.value,
          filter: solrParams?.filter.value,
          facet: {
            categories: {
              type: "terms",
              prefix,
              offset: (page - 1) * perPage,
              limit: perPage,
              numBuckets: true,
              field: "stratigraphy_categories",
              domain: {
                excludeTags: filterExclude,
              },
            },
          },
        },
      },
    });

    if (countRes.facets.categories.buckets.length < 1)
      return [[], 0];

    const values = countRes.facets.categories.buckets.map((bucket: any) => {
      const [_depth, value] = bucket.val.split("/");
      return value;
    });
    const res = await $solrFetch<any>("/stratigraphy", {
      query: {
        q: "*",
        fq: [`hierarchy_string:(${values.join(" OR ")})`],
        rows: values.length,
      },
    });

    return [countRes.facets.categories.buckets.map((bucket: any) => {
      const [_depth, value] = bucket.val.split("/");
      const doc = res.response.docs.find(
        (doc: any) => doc.hierarchy_string === value,
      );
      return {
        id: doc.id,
        name: { et: doc.stratigraphy, en: doc.stratigraphy_en },
        children: [],
        selected: filter.value.includes(value),
        childrenLoaded: false,
        showChildren: false,
        value,
        count: bucket.count,
        leaf: doc.leaf_node,
      };
    }) as TreeNode[], countRes.facets.categories.numBuckets];
  }

  const { locale } = useI18n();

  async function suggest(
    query: string,
    pagination: { page: number; perPage: number },
  ) {
    const searchField = locale.value === "et" ? "stratigraphy" : "stratigraphy_en";
    const queryStr = query.length < 1 ? "*" : `${searchField}:*${query}*`;
    const res = await $solrFetch<any>("/stratigraphy", {
      query: {
        q: queryStr,
        fq: "hierarchy_string:*",
        rows: pagination.perPage,
        start: (pagination.page - 1) * pagination.perPage,
        sort: `${searchField} asc`,
      },
    });

    return res.response.docs.map((doc: any) => ({
      id: doc.hierarchy_string,
      name: { et: doc.stratigraphy, en: doc.stratigraphy_en },
      value: doc.hierarchy_string,
    }));
  }

  return {
    suggest,
    getChildren,
    hydrate,
  };
}
export function useRockHierarchyFilter(
  path: string,
  {
    filterExclude,
    solrParams,
    filter,
  }: {
    filterExclude?: string;
    solrParams: {
      query: Ref<string>;
      filter: Ref<(string | { [K: string]: string })[]>;
    };
    filter: StringIdListFilter;
  },
) {
  const { $solrFetch } = useNuxtApp();
  const { locale } = useI18n();
  async function hydrate(values: string[]) {
    if (values.length < 1)
      return [];

    const res = await $solrFetch<any>("/rock", {
      query: {
        q: "*",
        fq: [`hierarchy_strings:(${values.join(" ")})`],
        limit: values.length,
      },
    });
    const facetQueries = res.response.docs.reduce((prev: { [K: string]: { type: string; q: string } }, doc: any) => {
      prev[doc.id] = {
        type: "query",
        q: `rock_categories:*/${doc.hierarchy_strings[0]}*`,
      };
      return prev;
    }, {} as { [K: string]: { type: string; q: string } });

    const countRes = await $solrFetch<any>(path, {
      query: {
        json: {
          limit: 0,
          query: solrParams.query.value,
          filter: solrParams.filter.value,
          facet: facetQueries,
        },
      },
    });

    return res.response.docs.map((doc: any) => ({
      id: doc.id,
      name: { et: doc.name, en: doc.name_en },
      value: doc.hierarchy_strings[0],
      count: countRes.facets[doc.id]?.count ?? 0,
    }));
  }
  async function getChildren(value: string, { page, perPage }: { page: number; perPage: number }): Promise<[TreeNode[], number]> {
    const depth = value.split("-").length;
    const prefix = value.length < 1 ? "0/" : `${depth}/${value}`;

    const countRes = await $solrFetch<any>(path, {
      query: {
        json: {
          limit: 0,
          query: solrParams.query.value,
          filter: solrParams.filter.value,
          facet: {
            categories: {
              type: "terms",
              prefix,
              offset: (page - 1) * perPage,
              limit: perPage,
              numBuckets: true,
              field: "rock_categories",
              domain: {
                excludeTags: filterExclude,
              },
            },
          },
        },
      },
    });

    if (countRes.facets.categories.buckets.length < 1)
      return [[], 0];

    const values = countRes.facets.categories.buckets.map((bucket: any) => {
      const [_depth, value] = bucket.val.split("/");
      return value;
    });
    const res = await $solrFetch<any>("/rock", {
      query: {
        q: "*",
        fq: [`hierarchy_strings:(${values.join(" OR ")})`],
        rows: values.length,
      },
    });

    return [countRes.facets.categories.buckets.map((bucket: any) => {
      const [_depth, value] = bucket.val.split("/");
      const doc = res.response.docs.find((doc: any) =>
        doc.hierarchy_strings.includes(value),
      );
      return {
        id: doc.id,
        name: { et: doc.name, en: doc.name_en },
        children: [],
        selected: filter.value.includes(value),
        childrenLoaded: false,
        showChildren: false,
        value,
        count: bucket.count,
        leaf: doc.leaf_node,
      };
    }), countRes.facets.categories.numBuckets];
  }

  async function suggest(
    query: string,
    pagination: { page: number; perPage: number },
  ) {
    const searchField = locale.value === "et" ? "name" : "name_en";
    const queryStr = query.length < 1 ? "*" : `${searchField}:*${query}*`;
    const res = await $solrFetch<any>("/rock", {
      query: {
        q: queryStr,
        rows: pagination.perPage,
        fq: "hierarchy_strings:*",
        start: (pagination.page - 1) * pagination.perPage,
        sort: `${searchField} asc`,
      },
    });

    return res.response.docs.map((doc: any) => ({
      id: doc.hierarchy_strings[0],
      name: { et: doc.name, en: doc.name_en },
      value: doc.hierarchy_strings[0],
    }));
  }

  return {
    suggest,
    getChildren,
    hydrate,
  };
}

export function useTaxonHierarchyFilter(
  path: string,
  {
    filterExclude,
    solrParams,
    filter,
  }: {
    filterExclude?: string;
    solrParams: {
      query: Ref<string>;
      filter: Ref<(string | { [K: string]: string })[]>;
    };
    filter: StringIdListFilter;
  },
) {
  const { $solrFetch } = useNuxtApp();

  async function hydrate(values: string[]) {
    if (values.length < 1)
      return [];

    const res = await $solrFetch<any>("/taxon", {
      query: {
        q: "*",
        fq: [`hierarchy_string:(${values.join(" ")})`],
        limit: values.length,
      },
    });
    const facetQueries = res.response.docs.reduce((prev: { [K: string]: { type: string; q: string } }, doc: any) => {
      prev[doc.id] = {
        type: "query",
        q: `taxon_hierarchy_descendent_paths:${doc.hierarchy_string}`,
      };
      return prev;
    }, {} as { [K: string]: { type: string; q: string } });

    const countRes = await $solrFetch<any>(path, {
      query: {
        json: {
          limit: 0,
          query: solrParams.query.value,
          filter: solrParams.filter.value,
          facet: facetQueries,
        },
      },
    });

    return res.response.docs.map((doc: any) => ({
      id: doc.id,
      name: { et: doc.taxon, en: doc.taxon },
      value: doc.hierarchy_string,
      count: countRes.facets[doc.id]?.count ?? 0,
    }));
  }

  async function getChildren(value: string, { page, perPage }: { page: number; perPage: number }): Promise<[TreeNode[], number]> {
    const depth = value.split("-").length;
    const prefix = `${depth}/${value}`;

    const countRes = await $solrFetch<any>(path, {
      query: {
        json: {
          limit: 0,
          query: solrParams.query.value,
          filter: solrParams.filter.value,
          facet: {
            categories: {
              type: "terms",
              prefix,
              offset: (page - 1) * perPage,
              limit: perPage,
              numBuckets: true,
              field: "taxon_categories",
              domain: {
                excludeTags: filterExclude,
              },
            },
          },
        },
      },
    });

    if (countRes.facets.categories.buckets.length < 1)
      return [[], 0];

    const values = countRes.facets.categories.buckets.map((bucket: any) => {
      const [_depth, value] = bucket.val.split("/");
      return value;
    });
    const res = await $solrFetch<any>("/taxon", {
      query: {
        q: "*",
        fq: [`hierarchy_string:(${values.join(" OR ")})`],
        rows: values.length,
      },
    });

    return [countRes.facets.categories.buckets
      .filter((bucket: any) => {
        const [_depth, value] = bucket.val.split("/");
        return res.response.docs.find(
          (doc: any) => doc.hierarchy_string === value,
        );
      })
      .map((bucket: any) => {
        const [_depth, value] = bucket.val.split("/");
        const doc = res.response.docs.find(
          (doc: any) => doc.hierarchy_string === value,
        );
        return {
          id: doc.id,
          name: { et: doc.taxon, en: doc.taxon },
          children: [],
          selected: filter.value.includes(value),
          childrenLoaded: false,
          showChildren: false,
          value,
          count: bucket.count,
          leaf: doc.leaf_node,
        };
      }) as TreeNode[], countRes.facets.categories.numBuckets];
  }

  async function suggest(
    query: string,
    pagination: { page: number; perPage: number },
  ) {
    const searchField = "taxon";
    const queryStr = query.length < 1 ? "*" : `${searchField}:*${query}*`;
    const res = await $solrFetch<any>("/taxon", {
      query: {
        q: queryStr,
        fq: "hierarchy_string:*",
        rows: pagination.perPage,
        start: (pagination.page - 1) * pagination.perPage,
        sort: `${searchField} asc`,
      },
    });

    return res.response.docs.map((doc: any) => ({
      id: doc.hierarchy_string,
      name: { et: doc.taxon, en: doc.taxon },
      value: doc.hierarchy_string,
    }));
  }

  return {
    suggest,
    getChildren,
    hydrate,
  };
}
