<template>
  <detail v-if="!pending" :loading="pending" :error="error">
    <template #title>
      <header-detail
        :ids="prevNext"
        :title="
          $translate({ et: drillcore.drillcore, en: drillcore.drillcore_en })
        "
        :search-to="localePath({ path: '/drillcore', query: getQueryParams() })"
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
            :title="$t('drillcore.name').toString()"
            :value="
              $translate({
                et: drillcore.drillcore,
                en: drillcore.drillcore_en,
              })
            "
          />
          <table-row
            :title="$t('drillcore.boxes').toString()"
            :value="drillcore.boxes"
          />
          <table-row
            :title="$t('drillcore.boxNumbers').toString()"
            :value="drillcore.box_numbers"
          />
          <table-row
            v-if="depository"
            :title="$t('drillcore.repository').toString()"
            :value="
              $translate({
                et: depository.value,
                en: depository.value_en,
              })
            "
          />
          <table-row
            v-if="storage"
            :title="$t('drillcore.storage').toString()"
            :value="storage.location"
          />
          <table-row
            v-if="agent"
            :title="$t('drillcore.driller').toString()"
            :value="agent.agent"
          />
          <table-row
            :title="$t('drillcore.year').toString()"
            :value="drillcore.year"
          />
          <table-row
            :title="$t('drillcore.metersInBox').toString()"
            :value="drillcore.number_meters"
          />

          <table-row-link
            v-if="database"
            :title="$t('drillcore.database').toString()"
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
            v-if="drillcore.date_added"
            :title="$t('drillcore.dateAdded').toString()"
            :value="$formatDate(drillcore.date_added)"
          />
          <table-row
            v-if="drillcore.date_changed"
            :title="$t('drillcore.dateChanged').toString()"
            :value="$formatDate(drillcore.date_changed)"
          />
        </base-table>
      </v-card-text>
      <div v-if="drillcore.remarks">
        <v-card-title class="subsection-title">{{
          $t("drillcore.remarks")
        }}</v-card-title>
        <v-card-text>{{ drillcore.remarks }}</v-card-text>
      </div>
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
                params: { id: drillcore.locality.id },
              })
            "
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
            :title="$t('locality.coordinates').toString()"
            :value="`${locality.latitude}, ${locality.longitude}`"
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
            :estonian-map="
              locality.country ? locality.country.value === 'Eesti' : false
            "
            :estonian-bedrock-overlay="
              locality.country ? locality.country.value === 'Eesti' : false
            "
            rounded
            borehole-overlay
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
                  et: locality.locality,
                  en: locality.locality_en,
                }),
              },
            ]"
          />
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
import type { RouteLocationRaw } from "vue-router";
import { TABS_DRILLCORE } from "~/constants";
const { $hydrateTab, $translate, $geoloogiaFetch } = useNuxtApp();
const { t } = useI18n();
const route = useRoute();
const validRoute = ref<RouteLocationRaw>({});

const drillcore = computed(() => data.value?.drillcore);
const depository = computed(() => data.value?.drillcore.depository);
const storage = computed(() => data.value?.drillcore.storage);
const agent = computed(() => data.value?.drillcore.agent);
const database = computed(() => data.value?.drillcore.database);
const locality = computed(() => data.value?.drillcore.locality);

const drillcoresStore = useDrillcores();
const { getQueryParams } = drillcoresStore;
const { solrFilters, solrQuery, solrSort, searchPosition, resultsCount } =
  storeToRefs(drillcoresStore);

const { prevNext } = await usePrevNext("/drillcore", {
  searchPosition,
  solrParams: computed(() => ({
    query: solrQuery.value,
    filter: solrFilters.value,
    sort: solrSort.value,
    fields: ["id", "drillcore", "drillcore_en"],
  })),
  count: resultsCount.value,
  mapper: (doc) => ({
    id: doc.id,
    name: {
      et: doc.drillcore,
      en: doc.drillcore_en,
    },
  }),
});

const { data, pending, error } = useLazyAsyncData("drillcore", async () => {
  const drillcoreResponse = await $geoloogiaFetch(
    `/drillcore/${route.params.id}/`,
    {
      query: {
        nest: 2,
      },
    },
  );
  let lasFileResponse;
  if (drillcoreResponse?.locality) {
    lasFileResponse = await $geoloogiaFetch("/attachment_link/", {
      query: {
        attachment__uuid_filename__iendswith: ".las",
        locality: drillcoreResponse.locality.id,
        fields: "attachment",
      },
    });
  }

  const tabsObject = TABS_DRILLCORE;

  tabsObject.byIds.boxes.count = drillcoreResponse.boxes || 0;
  tabsObject.byIds.analysis_results.count = lasFileResponse?.items?.[0]
    ?.attachment
    ? 1
    : 0;
  tabsObject.byIds.analysis_results.props = {
    drillcoreObject: drillcoreResponse,
    locality: drillcoreResponse?.locality?.id,
    attachment: lasFileResponse?.items?.[0]?.attachment?.toString(),
    analysisResultsCount: tabsObject.byIds.analysis_results.count,
  };

  const tabs = tabsObject.allIds.map((id) => tabsObject.byIds[id]);

  return {
    ids: drillcoreResponse?.ids,
    drillcore: drillcoreResponse,
    tabs: (drillcoreResponse?.locality?.id
      ? await Promise.all(
          tabs.map((tab) => {
            return $hydrateTab(tab, {
              props: { locality: drillcoreResponse?.locality?.id },
              countParams: {
                solr: {
                  default: {
                    fq: `locality_id:${drillcoreResponse?.locality?.id}`,
                  },
                },
                api: {
                  default: { locality: drillcoreResponse?.locality?.id },
                  boxes: { drillcore: route.params.id },
                  attachment_link: {
                    or_search: `drillcore:${drillcoreResponse.id} OR locality:${drillcoreResponse.locality.id}`,
                  },
                },
              },
            });
          }),
        )
      : tabs
    ).filter((tab) => {
      if (tab.id === "graphs") {
        return tab.props.attachment || tab.props.analysisResultsCount > 0;
      } else return tab.count > 0;
    }),
  };
});
const title = computed(() =>
  $translate({
    et: data.value?.drillcore.drillcore,
    en: data.value?.drillcore.drillcore_en,
  }),
);
useRedirectInvalidTabRoute({
  tabs: data.value?.tabs ?? [],
  watchableObject: data.value?.drillcore,
  pending,
  validRoute: validRoute,
});
// export default defineComponent({
//   setup() {
//     useMeta(() => {
//       return {
//         title: `${title.value} | ${i18n.t("drillcore.pageTitle")}`,
//         meta: [
//           {
//             property: "og:title",
//             content: `${title.value} | ${i18n.t("drillcore.pageTitle")}`,
//             hid: "og:title",
//           },
//           {
//             property: "og:url",
//             hid: "og:url",
//             content: route.value.path,
//           },
//         ],
//       };
//     });
//   },
// });
</script>
