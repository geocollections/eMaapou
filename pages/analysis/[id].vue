<template>
  <detail v-if="!pending" :loading="pending" :error="error">
    <template #title>
      <header-detail
        :ids="prevNext"
        :title="pageTitle"
        :search-to="localePath({ path: '/analysis', query: getQueryParams() })"
        @click:next="searchPosition++"
        @click:previous="searchPosition--"
      />
    </template>

    <template #column-left>
      <v-row no-gutters justify="center">
        <v-col>
          <v-card-title class="subsection-title">{{
            $t("common.general")
          }}</v-card-title>
          <v-card-text>
            <base-table>
              <table-row
                v-if="analysisMethod"
                :title="$t('analysis.method').toString()"
                :value="
                  $translate({
                    et: analysisMethod.analysis_method,
                    en: analysisMethod.method_en,
                  })
                "
              />
              <table-row
                v-if="agent"
                :title="$t('analysis.analysedBy').toString()"
                :value="agent.agent"
              />

              <table-row-link
                v-if="sample"
                :title="$t('analysis.sampleNumber').toString()"
                :value="sample.number"
                nuxt
                :href="
                  localePath({
                    name: 'sample-id',
                    params: { id: analysis.sample.id },
                  })
                "
              />

              <table-row
                :title="$t('analysis.remarks').toString()"
                :value="analysis.remarks"
              />
              <table-row-link
                v-if="reference"
                :title="$t('analysis.reference').toString()"
                :value="reference.reference"
                @link-click="$openGeology('reference', reference.id)"
              />
              <table-row
                v-if="dataset"
                :title="$t('analysis.dataset').toString()"
                :value="
                  $translate({
                    et: dataset.name,
                    en: dataset.name_en,
                  })
                "
              />
              <table-row-link
                v-if="sample && sample.locality"
                :title="$t('analysis.locality').toString()"
                :value="
                  $translate({
                    et: sample.locality.locality,
                    en: sample.locality.locality_en,
                  })
                "
                nuxt
                :href="
                  localePath({
                    name: 'locality-id',
                    params: { id: sample.locality.id },
                  })
                "
              />
              <table-row
                v-if="sample"
                :title="$t('analysis.depth').toString()"
                :value="sample.depth"
              />
              <table-row
                v-if="sample"
                :title="$t('analysis.depthInterval').toString()"
                :value="sample.depth_interval"
              />
              <table-row-link
                v-if="sample && sample.stratigraphy"
                :title="$t('analysis.stratigraphy').toString()"
                :value="
                  $translate({
                    et: sample.stratigraphy.stratigraphy,
                    en: sample.stratigraphy.stratigraphy_en,
                  })
                "
                nuxt
                :href="
                  localePath({
                    name: 'stratigraphy-id',
                    params: { id: sample.stratigraphy.id },
                  })
                "
              />
              <table-row-link
                v-if="sample && sample.lithostratigraphy"
                :title="$t('analysis.lithostratigraphy').toString()"
                :value="
                  $translate({
                    et: sample.lithostratigraphy.stratigraphy,
                    en: sample.lithostratigraphy.stratigraphy_en,
                  })
                "
                nuxt
                :href="
                  localePath({
                    name: 'stratigraphy-id',
                    params: { id: sample.lithostratigraphy.id },
                  })
                "
              />
              <table-row-link
                v-if="database"
                :title="$t('analysis.institution').toString()"
                :value="
                  $translate({
                    et: database.name,
                    en: database.name_en,
                  })
                "
                :href="database.url"
                target="DatabaseWindow"
              />

              <table-row
                v-if="analysis.date_added"
                :title="$t('analysis.dateAdded').toString()"
                :value="$formatDate(analysis.date_added)"
              />
              <table-row
                v-if="analysis.date_changed"
                :title="$t('analysis.dateChanged').toString()"
                :value="$formatDate(analysis.date_changed)"
              />
            </base-table>
          </v-card-text>
        </v-col>
      </v-row>
    </template>
    <template v-if="!isEmpty(resultChartData)" #column-right>
      <v-row no-gutters justify="center">
        <v-col>
          <v-card-title class="subsection-title">{{
            $t("analysis.resultColumn")
          }}</v-card-title>
          <chart-analysis-results :data="resultChartData" />
        </v-col>
      </v-row>
    </template>
    <template #bottom>
      <v-card v-if="data?.tabs.length > 0" class="mt-4 mb-4">
        <DetailTabs :tabs="data?.tabs" :init-active-tab="validRoute">
          <template #default="{ activeTabProps }">
            <NuxtPage v-bind="activeTabProps" />
          </template>
        </DetailTabs>
      </v-card>
    </template>
  </detail>
</template>

<script setup lang="ts">
import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";

import type { RouteLocationRaw } from "vue-router";
import sumBy from "lodash/sumBy";
import sortBy from "lodash/sortBy";
import { type Tab, TABS_ANALYSIS } from "~/constants";
const { $geoloogiaFetch, $solrFetch, $hydrateTab, $translate } = useNuxtApp();
const { t } = useI18n();
const route = useRoute();
const localePath = useLocalePath();
const validRoute = ref<RouteLocationRaw>({});

const analysis = computed(() => data.value?.analysis);
const resultChartData = computed(() => data.value?.resultChartData);
const database = computed(() => data.value?.analysis.database);
const analysisMethod = computed(
  () => data.value?.analysis.analysis_method ?? "",
);
const sample = computed(() => data.value?.analysis.sample);
const agent = computed(() => data.value?.analysis.agent);
const reference = computed(() => data.value?.analysis.reference);
const dataset = computed(() => data.value?.analysis.dataset);

const analysesStore = useAnalyses();
const { getQueryParams } = analysesStore;
const { solrFilters, solrQuery, solrSort, searchPosition, resultsCount } =
  storeToRefs(analysesStore);

const { prevNext } = await usePrevNext("/analysis", {
  searchPosition,
  solrParams: computed(() => ({
    query: solrQuery.value,
    filter: solrFilters.value,
    sort: solrSort.value,
    fields: ["id"],
  })),
  count: resultsCount.value,
  mapper: (doc) => ({
    id: doc.id,
    name: doc.id,
  }),
});

const { data, pending, error } = useLazyAsyncData("analysis", async () => {
  const analysisPromise = $geoloogiaFetch(`/analysis/${route.params.id}/`, {
    query: {
      nest: 2,
    },
  });

  const tabs = TABS_ANALYSIS.allIds.map((id) => TABS_ANALYSIS.byIds[id]);
  const hydratedTabsPromise = Promise.all(
    tabs.map(
      async (tab) =>
        await $hydrateTab(tab, {
          countParams: {
            solr: {
              default: { fq: `analysis_id:${route.params.id}` },
            },
            api: {
              default: { analysis: route.params.id },
            },
          },
        }),
    ),
  );
  const analysisResultPromise = $solrFetch("/analysis_results", {
    query: {
      fq: `analysis_id:${route.params.id}`,
      group: true,
      "group.field": "unit_id",
      "group.sort": "value desc",
      "group.limit": 100,
    },
  });
  const [analysisResponse, analysisResultResponse, hydratedTabs] =
    await Promise.all([
      analysisPromise,
      analysisResultPromise,
      hydratedTabsPromise,
    ]);
  hydratedTabs.filter((tab) => tab.count > 0);
  const ids = analysisResponse?.ids;
  const analysis = analysisResponse;

  const resultChartData = analysisResultResponse.grouped.unit_id.groups
    .map((group: any) => [group.groupValue, group.doclist.docs])
    .reduce((prev: any, [unitKey, unitResults]: any) => {
      const results = unitResults
        .filter((result: any) => result.value && result.value >= 0)
        .map((result: any) => {
          return {
            name: result.parameter,
            value: result.value,
          };
        });

      const valueSum = sumBy(results, "value");
      if (unitKey === "6") {
        results.push({ name: "Other", value: 100 - valueSum });
      }
      // if (unitKey === '7') {
      //   results.push({ name: 'Other', value: 1000000 - valueSum })
      // }

      return {
        ...prev,
        [unitKey]: sortBy(results, "value"),
      };
    }, {});

  return {
    tabs: hydratedTabs.filter((tab) => tab.count > 0),
    ids,
    analysis,
    resultChartData,
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

useRedirectInvalidTabRoute({
  tabs: data.value?.tabs ?? [],
  watchableObject: data.value?.analysis,
  pending,
  validRoute: validRoute,
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
