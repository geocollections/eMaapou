<template>
  <DetailNew>
    <template #title>
      <HeaderDetailNew :title="pageTitle">
        <template #tabs>
          <DetailTabs :tabs="data?.tabs" />
        </template>
      </HeaderDetailNew>
    </template>
    <NuxtPage v-bind="activeTabProps" />
  </DetailNew>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";
import type { Tab } from "~/composables/useTabs";
const { $geoloogiaFetch, $solrFetch, $hydrateTab, $translate } = useNuxtApp();
const { t } = useI18n();
const route = useRoute();
const localePath = useLocalePath();

const analysesStore = useAnalyses();
const { getQueryParams } = analysesStore;
const { solrFilters, solrQuery, solrSort, resultsCount } =
  storeToRefs(analysesStore);

const { hydrateTabs, filterHydratedTabs, getCurrentTabRouteProps } = useTabs();
const activeTabProps = computed(() => {
  return getCurrentTabRouteProps(data.value?.tabs ?? []);
});

const tabs = {
  general: {
    type: "static",
    routeName: "analysis-id",
    title: "common.general",
    props: {},
  } satisfies Tab,
  analysis_results: {
    type: "dynamic",
    routeName: "analysis-id-results",
    title: "analysis.results",
    count: async () => {
      const res = await $solrFetch("/analysis_results", {
        query: {
          q: `analysis_id:${route.params.id}`,
          rows: 0,
        },
      });
      return res.response.numFound;
    },
    props: {},
  } satisfies Tab,
  attachments: {
    type: "dynamic",
    routeName: "analysis-id-attachments",
    title: "analysis.attachments",
    count: async () => {
      const res = await $geoloogiaFetch("/attachment_link/", {
        query: {
          analysis: route.params.id,
          limit: 0,
        },
      });
      return res.count;
    },
    props: {},
  } satisfies Tab,
};

const { data, pending, error } = await useAsyncData("analysis", async () => {
  const analysis = await $geoloogiaFetch(`/analysis/${route.params.id}/`, {
    query: {
      nest: 2,
    },
    onResponseError: (error) => {
      if (error.response?.status === 404) {
        throw createError({
          statusCode: 404,
          message: "Locality not found",
        });
      }
    },
  });

  const hydratedTabs = await hydrateTabs(tabs, {
    props: {
      general: { analysis },
    },
  });

  return {
    analysis,
    tabs: filterHydratedTabs(hydratedTabs, [
      "general",
      "analysis_results",
      "attachments",
    ]),
  };
});

const pageTitle = computed(() =>
  t("analysis.title", {
    method: $translate({
      et: data.value?.analysis.analysis_method?.analysis_method,
      en: data.value?.analysis.analysis_method?.method_en,
    }),
    sample: data.value?.analysis.sample?.number,
  }),
);

redirectInvalidTab({
  redirectRoute: localePath({
    name: "analysis-id",
    params: { id: route.params.id },
  }),
  tabs: data.value?.tabs ?? [],
});
// export default defineComponent({
//   setup() {
//
//     useMeta(() => {
//       return {
//         title: `${pageTitle.value} | ${i18n.t('analysis.pageTitle')}`,
//         meta: [
//           {
//             property: 'og:title',
//             content: `${pageTitle.value} | ${i18n.t('analysis.pageTitle')}`,
//             hid: 'og:title',
//           },
//           {
//             property: 'og:url',
//             hid: 'og:url',
//             content: route.value.path,
//           },
//         ],
//       }
//     })
//     return {
//       ...toRefs(state),
//       database,
//       analysisMethod,
//       sample,
//       agent,
//       reference,
//       dataset,
//       pageTitle,
//       isEmpty,
//       isNil,
//     }
//   },
//   head: {},
// })
</script>
