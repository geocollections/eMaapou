<template>
  <detail-new :show-similar="showDrawer">
    <template #title>
      <header-detail-new :title="title">
        <template #tabs>
          <DetailTabs :tabs="data?.tabs" />
        </template>
      </header-detail-new>
    </template>
    <template #drawer>
      <SearchResultsDrawer
        :page="page"
        :results="similarPreparations"
        :total-results="preparationsRes?.response.numFound ?? 0"
        :search-route="
          localePath({ path: '/preparation', query: getQueryParams() })
        "
        :get-result-route="
          (item) =>
            localePath({ name: 'preparation-id', params: { id: item.id } })
        "
        @page:next="page++"
        @page:previous="page--"
        @select="handleSelect"
      >
        <template #itemTitle="{ item: preparation }">
          <div class="font-weight-medium">
            {{ preparation.preparation_number ?? preparation.id }}
          </div>
        </template>
      </SearchResultsDrawer>
    </template>
    <NuxtPage v-bind="activeTabProps" />
  </detail-new>
</template>

<script setup lang="ts">
import type { Tab } from "~/composables/useTabs";
const { $geoloogiaFetch } = useNuxtApp();
const route = useRoute();
const localePath = useLocalePath();

const preparationsStore = usePreparations();
const { getQueryParams } = preparationsStore;
const { solrFilters, solrQuery, solrSort } = storeToRefs(preparationsStore);
const {
  data: preparationsRes,
  page,
  handleSelect,
  showDrawer,
} = await useSearchResultsDrawer("/preparation", {
  routeName: "preparation-id",
  solrParams: {
    query: solrQuery,
    filter: solrFilters,
    sort: solrSort,
  },
});
const similarPreparations = computed(
  () => preparationsRes.value?.response.docs ?? [],
);

const { hydrateTabs, filterHydratedTabs, getCurrentTabRouteProps } = useTabs();
const activeTabProps = computed(() => {
  return getCurrentTabRouteProps(data.value?.tabs ?? []);
});
const tabs = {
  general: {
    type: "static",
    routeName: "preparation-id",
    title: "common.general",
    props: {},
  } satisfies Tab,
  attachment: {
    type: "dynamic",
    routeName: "preparation-id-attachments",
    title: "preparation.attachments",
    count: async () => {
      const response = await $geoloogiaFetch("/attachment_link/", {
        query: {
          preparation: route.params.id,
          limit: 0,
        },
      });

      return response.count;
    },
    props: {},
  } satisfies Tab,
  taxon: {
    type: "dynamic",
    routeName: "preparation-id-taxa",
    title: "preparation.taxa",
    count: async () => {
      const response = await $geoloogiaFetch("/taxon_list/", {
        query: {
          preparation: route.params.id,
          limit: 0,
        },
      });
      return response.count;
    },
    props: {},
  } satisfies Tab,
};

const { data } = await useAsyncData("preparation", async () => {
  const preparation = await $geoloogiaFetch(`/preparation/${route.params.id}`, {
    query: {
      nest: 1,
    },
    onResponseError: (error) => {
      if (error.response?.status === 404) {
        throw createError({
          statusCode: 404,
          message: "Preparation not found",
        });
      }
    },
  });

  const hydratedTabs = await hydrateTabs(tabs, {
    props: { general: { preparation } },
  });

  return {
    preparation,
    tabs: filterHydratedTabs(hydratedTabs, ["general", "attachment", "taxon"]),
  };
});
const title = computed(() => data.value?.preparation?.preparation_number);

redirectInvalidTab({
  redirectRoute: localePath({
    name: "preparation-id",
    params: { id: route.params.id },
  }),
  tabs: data.value?.tabs ?? [],
});
// export default defineComponent({
//   setup() {
//     useMeta(() => {
//       return {
//         title: `${title.value} | ${i18n.t("preparation.pageTitle")}`,
//         meta: [
//           {
//             property: "og:title",
//             hid: "og:title",
//             content: `${title.value} | ${i18n.t("preparation.pageTitle")}`,
//           },
//           {
//             property: "og:url",
//             hid: "og:url",
//             content: route.value.path,
//           },
//         ],
//       };
//     });
//     return {
//       ...toRefs(state),
//       title,
//       sample,
//       analysis,
//       taxon,
//       agent,
//       identificationAgent,
//       storage,
//       owner,
//       isNil,
//     };
//   },
//   head: {},
// });
</script>
