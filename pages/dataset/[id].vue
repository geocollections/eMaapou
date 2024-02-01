<template>
  <detail v-if="!pending" :loading="pending" :error="error">
    <template #title>
      <header-detail
        :ids="prevNext"
        :title="dataset.title"
        :search-to="localePath({ path: '/dataset', query: getQueryParams() })"
        @click:next="searchPosition++"
        @click:previous="searchPosition--"
      />
    </template>

    <template #column-left>
      <v-card-title class="subsection-title">{{
        $t("common.general")
      }}</v-card-title>
      <v-card-text>
        <base-table>
          <table-row
            :title="$t('dataset.title').toString()"
            :value="dataset.title"
          />
          <table-row
            :title="$t('dataset.titleTranslated').toString()"
            :value="dataset.title_translated"
          />
          <table-row
            :title="$t('dataset.titleAlt').toString()"
            :value="dataset.title_alternative"
          />
          <table-row
            v-if="dataset.creators || dataset.owner_txt || dataset.owner"
            :title="$t('dataset.creators').toString()"
            :value="
              dataset.creators || dataset.owner_txt || dataset.owner.agent
            "
          />
          <table-row
            :title="$t('dataset.publicationYear').toString()"
            :value="dataset.publication_year"
          />
          <table-row
            :title="$t('dataset.date').toString()"
            :value="dataset.date"
          />
          <table-row
            :title="$t('dataset.resourceTopic').toString()"
            :value="dataset.resource"
          />
          <table-row
            :title="$t('dataset.publisher').toString()"
            :value="dataset.publisher"
          />
          <table-row
            :title="$t('dataset.subjects').toString()"
            :value="dataset.subjects"
          />
          <table-row
            v-if="dataset.language"
            :title="$t('dataset.language').toString()"
            :value="
              $translate({
                et: dataset.language.value,
                en: dataset.language.value_en,
              })
            "
          />
          <table-row
            :title="$t('dataset.abstract').toString()"
            :value="dataset.abstract"
          />
          <table-row
            :title="$t('dataset.methods').toString()"
            :value="dataset.methods"
          />
          <table-row
            :title="$t('dataset.version').toString()"
            :value="dataset.version"
          />
          <table-row-link
            v-if="doi"
            :title="$t('dataset.doi').toString()"
            :value="doi"
            :href="`https://doi.geocollections.info/${doi}`"
          />
          <table-row-link
            v-if="reference"
            :title="$t('dataset.reference').toString()"
            :value="reference.reference"
            :href="`https://kirjandus.geoloogia.info/reference/${reference.id}`"
          />
          <table-row-link
            v-if="dataset.locality"
            :title="$t('dataset.locality').toString()"
            :value="
              $translate({
                et: dataset.locality.locality,
                en: dataset.locality.locality_en,
              })
            "
            nuxt
            :href="
              localePath({
                name: 'locality-id',
                params: { id: dataset.locality.id },
              })
            "
          />
          <table-row
            v-if="dataset.copyright_agent"
            :title="$t('dataset.copyright').toString()"
            :value="dataset.copyright_agent.agent"
          />
          <table-row-link
            v-if="dataset.licence"
            :title="$t('dataset.licence').toString()"
            :value="
              $translate({
                et: dataset.licence.licence,
                en: dataset.licence.licence_en,
              })
            "
            :href="
              $translate({
                et: dataset.licence.licence_url,
                en: dataset.licence.licence_url_en,
              })
            "
          />
          <table-row
            v-if="dataset.date_added"
            :title="$t('dataset.dateAdded').toString()"
            :value="$formatDate(dataset.date_added)"
          />
          <table-row
            v-if="dataset.date_changed"
            :title="$t('dataset.dateChanged').toString()"
            :value="$formatDate(dataset.date_changed)"
          />
          <table-row
            v-if="parameters.length > 0"
            :title="$t('dataset.parameters').toString()"
            :value="parameters"
          >
            <template #value>
              <v-chip
                v-for="(parameter, i) in parameters"
                :key="i"
                size="small"
                class="mr-1 mb-1"
              >
                {{ parameter.text }}
              </v-chip>
            </template>
          </table-row>
        </base-table>
      </v-card-text>
    </template>

    <template v-if="locationMarkers.length > 0" #column-right>
      <v-card-title class="subsection-title">{{
        $t("locality.map")
      }}</v-card-title>
      <v-card-text>
        <v-card id="map-wrap" elevation="0">
          <map-detail rounded :markers="locationMarkers" />
        </v-card>
      </v-card-text>
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
import type { RouteLocationRaw } from "vue-router";
import { type Tab, TABS_DATASET } from "~/constants";
import type { MapMarker } from "~/types/map";

const { $geoloogiaFetch, $solrFetch, $hydrateTab, $translate } = useNuxtApp();
const route = useRoute();
const validRoute = ref<RouteLocationRaw>({});
const localePath = useLocalePath();

const dataset = computed(() => data.value?.dataset);
const doi = computed(() => data.value?.doi);
const reference = computed(() => data.value?.reference);
const parameters = computed(() => data.value?.parameters);
const locationMarkers = computed(() => data.value?.locationMarkers ?? []);

const datasetsStore = useDatasets();
const { getQueryParams } = datasetsStore;
const { solrFilters, solrQuery, solrSort, searchPosition, resultsCount } =
  storeToRefs(datasetsStore);
const { prevNext } = await usePrevNext("/dataset", {
  searchPosition,
  solrParams: computed(() => ({
    query: solrQuery.value,
    filter: solrFilters.value,
    sort: solrSort.value,
    fields: ["id", "name", "name_en"],
  })),
  count: resultsCount.value,
  mapper: (doc) => ({
    id: doc.id,
    name: { et: doc.name, en: doc.name_en },
  }),
});
const { data, pending, error } = useLazyAsyncData("dataset", async () => {
  const datasetPromise = $geoloogiaFetch(`/dataset/${route.params.id}/`, {
    query: {
      nest: 1,
    },
  });
  const parametersPromise = $solrFetch("/dataset", {
    query: {
      q: `id:${route.params.id}`,
      fl: "parameter_index_list,parameter_list",
    },
  });
  const doiPromise = $geoloogiaFetch("/doi/", {
    query: {
      dataset: route.params.id,
      nest: 1,
    },
  });
  const localityGroupedPromise = $solrFetch("/analysis", {
    query: {
      q: "*",
      fq: `dataset_ids:${route.params.id}`,
      fl: "locality_id,locality,locality_en,latitude,longitude,site_id,name,name_en",
      group: true,
      "group.field": ["locality_id", "site_id"],
      rows: 10000,
    },
  });

  const tabs = TABS_DATASET.allIds.map((id) => TABS_DATASET.byIds[id]);
  const hydratedTabsPromise = Promise.all(
    tabs.map((tab) => {
      return $hydrateTab(tab, {
        countParams: {
          solr: {
            default: { fq: `dataset_ids:${route.params.id}` },
          },
          api: {
            default: { dataset: route.params.id },
          },
        },
      });
    }),
  ).then((res): { [K: string]: any } => {
    return res.reduce((prev, tab): { [K: string]: any } => {
      return { ...prev, [tab.id]: tab };
    }, {});
  });
  const [
    datasetResponse,
    parametersResponse,
    doiResponse,
    localityGroupedResponse,
    hydratedTabsByIds,
  ] = await Promise.all([
    datasetPromise,
    parametersPromise,
    doiPromise,
    localityGroupedPromise,
    hydratedTabsPromise,
  ]);

  const ids = datasetResponse?.ids;
  const dataset = datasetResponse;

  const parameterValues =
    parametersResponse.response.docs[0]?.parameter_index_list?.[0]?.split("; ");
  const parameterText =
    parametersResponse.response.docs[0]?.parameter_list?.[0]?.split("; ");

  const parameters =
    parameterValues?.map((v: string, i: number) => {
      return { text: parameterText[i], value: v };
    }) ?? [];

  const parameterHeaders = {
    byIds: parameters.reduce((prev, parameter) => {
      return { ...prev, [parameter.value]: { ...parameter, show: false } };
    }, {}),
    allIds: parameterValues,
  };

  const doi = doiResponse.results?.[0]?.identifier;
  const reference = {
    id: doiResponse.results?.[0]?.reference?.id,
    reference: doiResponse.results?.[0]?.reference?.reference,
  };

  const localities = localityGroupedResponse?.grouped?.locality_id?.groups
    ?.map((item: any) => item?.doclist?.docs?.[0])
    .filter((item: any) => {
      return !isEmpty(item) && item?.locality_id;
    });
  const sites = localityGroupedResponse?.grouped?.site_id?.groups
    ?.map((item: any) => item?.doclist?.docs?.[0])
    .filter((item: any) => {
      return !isEmpty(item) && item?.site_id;
    });
  const locationMarkers = localities
    .concat(sites)
    .reduce((filtered: MapMarker[], item): MapMarker[] => {
      if (!(item.latitude && item.longitude)) return filtered;
      const isItemInArray = filtered.some(
        (existingItem) =>
          existingItem.latitude === item.latitude &&
          existingItem.longitude === item.longitude,
      );
      if (isItemInArray) return filtered;

      const newItem = {
        latitude: item.latitude,
        longitude: item.longitude,
        text:
          $translate({ et: item.locality, en: item.locality_en }) ??
          (item.name || `ID: ${item.id}`),
        routeName: item.locality_id ? "locality" : "site",
        id: item.locality_id ?? item.site_id,
      };

      return [...filtered, newItem];
    }, []);

  hydratedTabsByIds.sample_results.props.parameterHeaders = {
    ...parameterHeaders,
    byIds: Object.fromEntries(
      Object.entries(parameterHeaders.byIds).map(([k, v]) => {
        return [k, { ...v, show: true }];
      }),
    ),
  };

  hydratedTabsByIds.graphs.count =
    locationMarkers.length === 1 ? locationMarkers.length : 0;
  hydratedTabsByIds.graphs.props.dataset = dataset;

  return {
    ids,
    dataset,
    tabs: TABS_DATASET.allIds
      .map((id) => hydratedTabsByIds[id])
      .filter((tab) => tab.count > 0),
    parameters,
    parameterHeaders,
    doi,
    reference,
    locationMarkers,
    localities,
  };
});
const title = computed(() => data.value?.dataset.title);

useRedirectInvalidTabRoute({
  tabs: data.value?.tabs ?? [],
  watchableObject: data.value?.dataset,
  pending: pending,
  validRoute: validRoute,
});

// export default defineComponent({
//   setup() {
//     useMeta(() => {
//       return {
//         title: `${title.value}| ${i18n.t("dataset.pageTitle")}`,
//         meta: [
//           {
//             property: "og:title",
//             content: `${title.value}| ${i18n.t("dataset.pageTitle")}`,
//             hid: "og:title",
//           },
//           {
//             property: "og:description",
//             content: data.value?.dataset.abstract,
//             hid: "og:description",
//           },
//           {
//             property: "description",
//             content: data.value?.dataset.abstract,
//             hid: "description",
//           },
//         ],
//       };
//     });
//   },
// });
//
</script>

<style lang="scss" scoped>
.active-tab {
  background-color: rgb(var(--v-theme-grey-lighten3)) !important;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: var(--v-theme-accent-lighten2) !important;

  &:before {
    background-color: white !important;
  }
}
</style>
