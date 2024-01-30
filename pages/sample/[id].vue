<template>
  <detail v-if="!pending" :loading="pending" :error="error">
    <template #title>
      <header-detail
        :ids="prevNext"
        :title="pageTitle"
        :search-to="localePath({ path: '/locality', query: getQueryParams() })"
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
            :title="$t('sample.number').toString()"
            :value="sample.number"
          />
          <table-row-link
            v-if="parent"
            :title="$t('sample.parent').toString()"
            nuxt
            :href="localePath({ name: 'sample-id', params: { id: parent.id } })"
            :value="parent.number"
          />
          <table-row-link
            v-if="parentSpecimen"
            :title="$t('sample.parentSpecimen').toString()"
            nuxt
            :href="
              localePath({
                name: 'specimen-id',
                params: { id: parentSpecimen.id },
              })
            "
            :value="parentSpecimen.specimen_id"
          />
          <table-row-link
            :title="$t('sample.igsn').toString()"
            :value="sample.igsn"
            :href="`http://igsn.org/${sample.igsn}`"
          />
          <table-row
            :title="$t('sample.numberAdditional').toString()"
            :value="sample.number_additional"
          />
          <table-row
            :title="$t('sample.numberField').toString()"
            :value="sample.number_field"
          />
          <table-row-link
            v-if="locality"
            :title="$t('sample.locality').toString()"
            :value="
              $translate({
                et: locality.locality,
                en: locality.locality_en,
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
            v-if="locality"
            :title="$t('sample.latitude').toString()"
            :value="locality.latitude"
          />
          <table-row
            v-if="locality"
            :title="$t('sample.longitude').toString()"
            :value="locality.longitude"
          />
          <table-row-link
            v-if="site"
            :title="$t('sample.site').toString()"
            :value="site.name"
            nuxt
            :href="
              localePath({
                name: 'site-id',
                params: { id: site.id },
              })
            "
          />
          <table-row
            v-if="site"
            :title="$t('sample.latitude').toString()"
            :value="site.latitude"
          />
          <table-row
            v-if="site"
            :title="$t('sample.longitude').toString()"
            :value="site.longitude"
          />
          <table-row
            :title="$t('sample.depth').toString()"
            :value="sample.depth"
          />
          <table-row
            :title="$t('sample.depthInterval').toString()"
            :value="sample.depth_interval"
          />
          <table-row-link
            v-if="stratigraphy"
            :title="$t('sample.stratigraphy').toString()"
            :value="
              $translate({
                et: stratigraphy.stratigraphy,
                en: stratigraphy.stratigraphy_en,
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
            v-if="lithostratigraphy"
            :title="$t('sample.lithostratigraphy').toString()"
            :value="
              $translate({
                et: lithostratigraphy.stratigraphy,
                en: lithostratigraphy.stratigraphy_en,
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
          <table-row
            :title="$t('sample.stratigraphyFree').toString()"
            :value="sample.stratigraphy_free"
          />
          <table-row
            :title="$t('sample.stratigraphyBed').toString()"
            :value="sample.stratigraphy_bed"
          />
          <table-row
            :title="$t('sample.dateCollected').toString()"
            :value="sample.date_collected || sample.date_collected_free"
          />
          <table-row
            v-if="agentCollected || sample.agent_collected_txt"
            :title="$t('sample.agentCollected').toString()"
            :value="agentCollected.agent || sample.agent_collected_txt"
          />
          <table-row
            :title="$t('sample.mass').toString()"
            :value="sample.mass"
          />
          <table-row
            v-if="series"
            :title="$t('sample.series').toString()"
            :value="series.name"
          />
          <table-row
            v-if="samplePurpose"
            :title="$t('sample.samplePurpose').toString()"
            :value="
              $translate({
                et: samplePurpose.value,
                en: samplePurpose.value_en,
              })
            "
          />
          <table-row
            :title="$t('sample.rock').toString()"
            :value="
              $translate({
                et: sample.rock,
                en: sample.rock_en,
              })
            "
          />
          <table-row
            v-if="classificationRock"
            :title="$t('sample.classificationRock').toString()"
            :value="
              $translate({
                et: classificationRock.name,
                en: classificationRock.name_en,
              })
            "
          />
          <table-row
            :title="$t('sample.palaeontology').toString()"
            :value="sample.palaeontology"
          />
          <table-row
            :title="$t('sample.fossils').toString()"
            :value="sample.fossils"
          />
          <table-row
            :title="$t('sample.remarks').toString()"
            :value="sample.remarks"
          />
          <table-row
            v-if="owner"
            :title="$t('sample.owner').toString()"
            :value="owner.agent"
          />
          <table-row-link
            v-if="database"
            :title="$t('sample.database').toString()"
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
            v-if="project"
            :title="$t('sample.project').toString()"
            :value="
              $translate({
                et: sample.project.name,
                en: sample.project.name_en,
              })
            "
          />
          <table-row
            v-if="sample.date_added"
            :title="$t('sample.dateAdded').toString()"
            :value="$formatDate(sample.date_added)"
          />
          <table-row
            v-if="sample.date_changed"
            :title="$t('sample.dateChanged').toString()"
            :value="$formatDate(sample.date_changed)"
          />
        </base-table>
      </v-card-text>
    </template>

    <template v-if="locality" #column-right>
      <v-card-title class="subsection-title">{{
        $t("locality.locality")
      }}</v-card-title>
      <v-card-text>
        <base-table class="mb-4">
          <table-row-link
            :title="$t('locality.locality').toString()"
            :value="
              $translate({
                et: locality.locality,
                en: locality.locality_en,
              })
            "
            nuxt
            :href="
              localePath({
                name: 'locality-id',
                params: { id: sample.locality.id },
              })
            "
          >
          </table-row-link>
          <table-row
            :title="$t('sample.localityFree').toString()"
            :value="sample.locality_free"
          />
          <table-row
            v-if="locality.country"
            :title="$t('locality.country').toString()"
            :value="
              $translate({
                et: locality.country.value,
                en: locality.country.value_en,
              })
            "
          />
          <table-row
            :title="$t('locality.latitude').toString()"
            :value="locality.latitude"
          />
          <table-row
            :title="$t('locality.longitude').toString()"
            :value="locality.longitude"
          />
          <table-row
            :title="$t('locality.elevation').toString()"
            :value="locality.elevation"
          />
          <table-row
            :title="$t('locality.depth').toString()"
            :value="locality.depth"
          />
        </base-table>
        <v-card
          v-if="locality.latitude && locality.longitude"
          id="map-wrap"
          elevation="0"
        >
          <map-detail
            rounded
            :estonian-map="
              locality.country ? locality.country.value === 'Eesti' : false
            "
            :estonian-bedrock-overlay="
              locality.country ? locality.country.value === 'Eesti' : false
            "
            height="300px"
            :center="{
              latitude: locality.latitude,
              longitude: locality.longitude,
            }"
            :markers="[
              {
                latitude: locality.latitude,
                longitude: locality.longitude,
                text: $translate({
                  et: sample.drillcore,
                  en: sample.drillcore_en,
                }),
              },
            ]"
          />
        </v-card>
      </v-card-text>
    </template>

    <template v-else-if="data?.locations.length > 0" #column-right>
      <v-card-title class="subsection-title">{{
        $t("locality.map")
      }}</v-card-title>
      <v-card-text>
        <v-card elevation="0">
          <map-detail rounded :markers="locations" />
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
import isNil from "lodash/isNil";
import type { RouteLocationRaw } from "vue-router";
import type { Tab } from "~/constants";
import { TABS_SAMPLE } from "~/constants";

const route = useRoute();
const localePath = useLocalePath();
const { t } = useI18n();
const validRoute = ref<RouteLocationRaw>({});
const samplesStore = useSamples();
const { getQueryParams } = samplesStore;
const { solrFilters, solrQuery, solrSort, searchPosition, resultsCount } =
  storeToRefs(samplesStore);

const sample = computed(() => data.value?.sample);
const parentSpecimen = computed(() => data.value?.sample.parent_specimen);
const parent = computed(() => data.value?.sample.parent_sample);
const project = computed(() => data.value?.sample.project);
const database = computed(() => data.value?.sample.database);
const owner = computed(() => data.value?.sample.owner);
const classificationRock = computed(
  () => data.value?.sample.classification_rock,
);
const samplePurpose = computed(() => data.value?.sample.sample_purpose);
const agentCollected = computed(() => data.value?.sample.agent_collected);
const lithostratigraphy = computed(() => data.value?.sample.lithostratigraphy);
const stratigraphy = computed(() => data.value?.sample.stratigraphy);
const site = computed(() => data.value?.sample.site);
const series = computed(() => data.value?.sample.series);
const locality = computed(() => data.value?.sample.locality);
const { $geoloogiaFetch, $solrFetch, $hydrateTab, $translate } = useNuxtApp();

const { prevNext } = await usePrevNext("/locality", {
  searchPosition,
  solrParams: computed(() => ({
    query: solrQuery.value,
    filter: solrFilters.value,
    sort: solrSort.value,
    fields: ["id", "number"],
  })),
  count: resultsCount.value,
  mapper: (doc) => ({
    id: doc.id,
    name: doc.number ?? doc.id,
  }),
});

const { data, pending, error } = useLazyAsyncData("sample", async () => {
  const samplePromise = $geoloogiaFetch(`/sample/${route.params.id}/`, {
    query: {
      nest: 2,
    },
  });
  const localityGroupedPromise = $solrFetch("/analysis", {
    query: {
      fq: `sample_id:${route.params.id}`,
      fl: "locality_id,locality,locality_en,latitude,longitude,site_id,name,name_en",
      group: true,
      "group.field": ["locality_id", "site_id"],
      rows: 10000,
    },
  });
  const tabsObject = TABS_SAMPLE;

  const tabs = tabsObject.allIds.map((id) => tabsObject.byIds[id]);
  const hydratedTabsPromise = Promise.all(
    tabs.map((tab) =>
      $hydrateTab(tab, {
        countParams: {
          solr: { default: { fq: `sample_id:${route.params.id}` } },
          api: { default: { sample: route.params.id } },
        },
      }),
    ),
  ).then((res): { [K: string]: any } => {
    return res.reduce((prev, tab): { [K: string]: any } => {
      return { ...prev, [tab.id]: tab };
    }, {});
  });
  const [sampleResponse, localityGroupedResponse, hydratedTabsByIds] =
    await Promise.all([
      samplePromise,
      localityGroupedPromise,
      hydratedTabsPromise,
    ]);
  const sample = sampleResponse;

  hydratedTabsByIds.graphs.props.sampleObject = sample;

  const localities = localityGroupedResponse?.grouped?.locality_id?.groups
    ?.map((item: any) => item?.doclist?.docs?.[0])
    .filter((item: any) => !isEmpty(item) && item?.locality_id);
  const sites = localityGroupedResponse?.grouped?.site_id?.groups
    ?.map((item: any) => item?.doclist?.docs?.[0])
    .filter((item: any) => !isEmpty(item) && item?.site_id);

  const locations = localities
    .concat(sites)
    .reduce((filtered: any[], item: any) => {
      if (!(item.latitude && item.longitude)) return filtered;
      const isItemInArray = filtered.some(
        (existingItem: any) =>
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

  if (sample?.site) {
    locations.push({
      latitude: sample.site.latitude,
      longitude: sample.site.longitude,
      text: sample.site.name,
      routeName: "site",
      id: sample.site_id,
    });
  }
  return {
    ids: sampleResponse?.ids,
    sample,
    locations,
    tabs: TABS_SAMPLE.allIds
      .map((id) => hydratedTabsByIds[id])
      .filter((tab) => tab.count > 0),
  };
});
const title = computed(() =>
  `${
    data.value?.sample?.number ||
    data.value?.sample?.number_additional ||
    data.value?.sample?.number_field ||
    data.value?.sample?.id
  }`.trim(),
);
const pageTitle = computed(() => `${t("sample.number")} ${title.value}`);
useRedirectInvalidTabRoute({
  tabs: data.value?.tabs ?? [],
  watchableObject: data.value?.sample,
  pending: pending,
  validRoute: validRoute,
});
// export default defineComponent({
//   setup() {
//     const { i18n, $hydrateTab, $services, $translate } = useContext()
//     const route = useRoute()
//
//     const state = reactive({
//       sample: null as any,
//       tabs: [] as Tab[],
//       locations: [] as any[],
//       validRoute: {} as Location,
//       ids: {} as any,
//     })
//
//     const parentSpecimen = computed(() => data.value?.sample?.parent_specimen)
//     const parent = computed(() => data.value?.sample?.parent_sample)
//     const project = computed(() => data.value?.sample?.project)
//     const database = computed(() => data.value?.sample?.database)
//     const owner = computed(() => data.value?.sample?.owner)
//     const classificationRock = computed(() => data.value?.sample?.classification_rock)
//     const samplePurpose = computed(() => data.value?.sample?.sample_purpose)
//     const agentCollected = computed(() => data.value?.sample?.agent_collected)
//     const lithostratigraphy = computed(() => data.value?.sample?.lithostratigraphy)
//     const stratigraphy = computed(() => data.value?.sample?.stratigraphy)
//     const site = computed(() => data.value?.sample?.site)
//     const series = computed(() => data.value?.sample?.series)
//     const locality = computed(() => data.value?.sample?.locality)
//
//     const { fetchState } = useFetch(async () => {
//       const samplePromise = $services.sarvREST.getResource(
//         'sample',
//         parseInt(route.value.params.id),
//         {
//           params: {
//             nest: 2,
//           },
//         }
//       )
//       const localityGroupedPromise = $services.sarvSolr.getResourceList(
//         'analysis',
//         {
//           defaultParams: {
//             fq: `sample_id:${route.value.params.id}`,
//             fl: 'locality_id,locality,locality_en,latitude,longitude,site_id,name,name_en',
//             group: true,
//             'group.field': ['locality_id', 'site_id'],
//             rows: 10000,
//           },
//         }
//       )
//       const tabsObject = TABS_SAMPLE
//
//       const tabs = tabsObject.allIds.map((id) => tabsObject.byIds[id])
//       const hydratedTabsPromise = Promise.all(
//         tabs.map((tab) =>
//           $hydrateTab(tab, {
//             countParams: {
//               solr: { default: { fq: `sample_id:${route.value.params.id}` } },
//               api: { default: { sample: route.value.params.id } },
//             },
//           })
//         )
//       ).then((res): { [K: string]: any } => {
//         return res.reduce((prev, tab): { [K: string]: any } => {
//           return { ...prev, [tab.id]: tab }
//         }, {})
//       })
//       const [sampleResponse, localityGroupedResponse, hydratedTabsByIds] =
//         await Promise.all([
//           samplePromise,
//           localityGroupedPromise,
//           hydratedTabsPromise,
//         ])
//       state.ids = sampleResponse?.ids
//       data.value?.sample = sampleResponse
//
//       hydratedTabsByIds.graphs.props.sampleObject = data.value?.sample
//       state.tabs = TABS_SAMPLE.allIds
//         .map((id) => hydratedTabsByIds[id])
//         .filter((tab) => tab.count > 0)
//
//       const localities = localityGroupedResponse?.grouped?.locality_id?.groups
//         ?.map((item: any) => item?.doclist?.docs?.[0])
//         .filter((item: any) => !isEmpty(item) && item?.locality_id)
//       const sites = localityGroupedResponse?.grouped?.site_id?.groups
//         ?.map((item: any) => item?.doclist?.docs?.[0])
//         .filter((item: any) => !isEmpty(item) && item?.site_id)
//
//       state.locations = localities
//         .concat(sites)
//         .reduce((filtered: any[], item: any) => {
//           if (!(item.latitude && item.longitude)) return filtered
//           const isItemInArray = filtered.some(
//             (existingItem: any) =>
//               existingItem.latitude === item.latitude &&
//               existingItem.longitude === item.longitude
//           )
//           if (isItemInArray) return filtered
//
//           const newItem = {
//             latitude: item.latitude,
//             longitude: item.longitude,
//             text:
//               $translate({ et: item.locality, en: item.locality_en }) ??
//               (item.name || `ID: ${item.id}`),
//             routeName: item.locality_id ? 'locality' : 'site',
//             id: item.locality_id ?? item.site_id,
//           }
//           return [...filtered, newItem]
//         }, [])
//
//       if (data.value?.sample?.site) {
//         state.locations.push({
//           latitude: data.value?.sample.site.latitude,
//           longitude: data.value?.sample.site.longitude,
//           text: data.value?.sample.site.name,
//           routeName: 'site',
//           id: data.value?.sample.site_id,
//         })
//       }
//     })
//
//     const title = computed(() =>
//       `${
//         data.value?.sample?.number ||
//         data.value?.sample?.number_additional ||
//         data.value?.sample?.number_field ||
//         data.value?.sample?.id
//       }`.trim()
//     )
//     const pageTitle = computed(
//       () => `${i18n.t('sample.number')} ${title.value}`
//     )
//     useRedirectInvalidTabRoute({
//       tabs: toRef(state, 'tabs'),
//       watchableObject: toRef(state, 'sample'),
//       pending: toRef(fetchState, 'pending'),
//       validRoute: toRef(state, 'validRoute'),
//     })
//     useMeta(() => {
//       return {
//         title: `${title.value} | ${i18n.t('sample.pageTitle')}`,
//         meta: [
//           {
//             property: 'og:title',
//             hid: 'og:title',
//             content: `${title.value} | ${i18n.t('sample.pageTitle')}`,
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
//       parentSpecimen,
//       parent,
//       project,
//       database,
//       owner,
//       classificationRock,
//       samplePurpose,
//       agentCollected,
//       lithostratigraphy,
//       stratigraphy,
//       site,
//       series,
//       locality,
//       title,
//       pageTitle,
//       isNil,
//     }
//   },
//   head: {},
// })
</script>
