<template>
  <detail v-if="!pending" :loading="pending" :error="error">
    <template #title>
      <header-detail
        :title="pageTitle"
        :search-to="localePath({ path: '/drillcore', query: getQueryParams() })"
      />
    </template>
    <template #top>
      <v-card v-if="activeImage" class="my-2">
        <v-card-text>
          <v-hover v-slot="{ hover }">
            <!-- TODO: Add placeholder, for case when box does not have a picture (filename check) -->
            <v-img
              contain
              class="rounded cursor-pointer ma-4 transition-swing"
              :class="{
                'elevation-8': hover,
                'elevation-4': !hover,
              }"
              :lazy-src="
                img(
                  activeImage.attachment.uuid_filename,
                  { size: 'small' },
                  { provider: 'geocollections' },
                )
              "
              :src="
                img(
                  activeImage.attachment.uuid_filename,
                  { size: 'large' },
                  { provider: 'geocollections' },
                )
              "
              max-width="2000"
              max-height="1000"
              @click="$openImage(activeImage.attachment.uuid_filename)"
            >
              <template #placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-hover>

          <!-- eslint-disable prettier/prettier -->
          <div
            class="justify-center mx-8 d-flex flex-column justify-md-space-between flex-md-row"
          >
            <!-- eslint-enable prettier/prettier -->
            <div class="text-center text-md-left">
              <!-- <div
                v-if="
                  activeImage.attachment.author ||
                  activeImage.attachment.author_free
                "
              >
                <span class="font-weight-bold"
                  >{{ $t('drillcoreBox.author') }}:
                </span>
                <span v-if="activeImage.attachment.author.agent">{{
                  activeImage.attachment.author.agent
                }}</span>
                <span v-else>{{ activeImage.attachment.author_free }}</span>
              </div> -->
              <!-- <div
                v-if="
                  activeImage.attachment.date_created ||
                  activeImage.attachment.date_created_free
                "
              >
                <span class="font-weight-bold"
                  >{{ $t('drillcoreBox.date') }}:
                </span>
                <span v-if="activeImage.attachment.date_created">{{
                  activeImage.attachment.date_created
                }}</span>
                <span v-else>{{
                  activeImage.attachment.date_created_free
                }}</span>
              </div> -->
            </div>

            <div class="text-center">
              <span v-for="(size, index) in imageSizes" :key="index">
                <a
                  class="text-link"
                  @click="
                    $openImage(activeImage.attachment.uuid_filename, size)
                  "
                >
                  {{ $t(`common.${size}`) }}
                </a>
                <span v-if="index < imageSizes.length - 1">| </span>
              </span>
            </div>
          </div>
        </v-card-text>

        <v-card-text
          v-if="drillcoreBoxImages && drillcoreBoxImages.length > 1"
          class="pt-0"
        >
          <div class="d-flex ma-2 align-center" style="overflow-x: auto">
            <div
              v-for="(item, index) in drillcoreBoxImages"
              :key="index"
              class="ma-2"
            >
              <v-hover v-slot="{ hover }">
                <v-img
                  :src="
                    $img(
                      item.attachment.uuid_filename,
                      { size: 'small' },
                      { provider: 'geocollections' },
                    )
                  "
                  :lazy-src="
                    $img(
                      item.attachment.uuid_filename,
                      { size: 'small' },
                      { provider: 'geocollections' },
                    )
                  "
                  max-width="200"
                  max-height="200"
                  :class="{
                    'elevation-4': hover,
                    'elevation-2': !hover,
                  }"
                  class="rounded cursor-pointer grey lighten-2 transition-swing"
                  @click="activeImage = drillcoreBoxImages[index]"
                >
                  <template #placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                      ></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
              </v-hover>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </template>
    <template #default>
      <v-card>
        <v-card-title class="subsection-title">{{
          $t("common.general")
        }}</v-card-title>
        <v-card-text>
          <base-table>
            <table-row-link
              v-if="drillcore"
              nuxt
              :title="$t('drillcoreBox.drillcore').toString()"
              :value="
                $translate({
                  et: drillcore.drillcore,
                  en: drillcore.drillcore_en,
                })
              "
              :href="
                localePath({
                  name: 'drillcore-id',
                  params: { id: drillcore.id },
                })
              "
            />
            <table-row
              :title="$t('drillcoreBox.depthStart').toString()"
              :value="drillcoreBox.depth_start"
            />
            <table-row
              :title="$t('drillcoreBox.depthEnd').toString()"
              :value="drillcoreBox.depth_end"
            />
            <table-row
              :title="$t('drillcoreBox.depthOther').toString()"
              :value="drillcoreBox.depth_other"
            />
            <table-row
              :title="$t('drillcoreBox.diameter').toString()"
              :value="drillcoreBox.diameter"
            />
            <table-row-link
              v-if="drillcoreBox.stratigraphy_top"
              :title="$t('drillcoreBox.stratigraphyTop').toString()"
              :value="
                $translate({
                  et: drillcoreBox.stratigraphy_top.stratigraphy,
                  en: drillcoreBox.stratigraphy_top.stratigraphy_en,
                })
              "
              nuxt
              :href="
                localePath({
                  name: 'stratigraphy-id',
                  params: { id: drillcoreBox.stratigraphy_top.id },
                })
              "
            />
            <table-row
              :title="$t('drillcoreBox.stratigraphyTopFree').toString()"
              :value="drillcoreBox.stratigraphy_top_free"
            />
            <table-row-link
              v-if="drillcoreBox.stratigraphy_base"
              :title="$t('drillcoreBox.stratigraphyBase').toString()"
              :value="
                $translate({
                  et: drillcoreBox.stratigraphy_base.stratigraphy,
                  en: drillcoreBox.stratigraphy_base.stratigraphy_en,
                })
              "
              nuxt
              :href="
                localePath({
                  name: 'stratigraphy-id',
                  params: { id: drillcoreBox.stratigraphy_base.id },
                })
              "
            />
            <table-row
              :title="$t('drillcoreBox.stratigraphyBaseFree').toString()"
              :value="drillcoreBox.stratigraphy_base_free"
            />

            <table-row
              v-if="drillcoreBox.date_added"
              :title="$t('drillcoreBox.dateAdded').toString()"
              :value="$formatDate(drillcoreBox.date_added)"
            />
            <table-row
              v-if="drillcoreBox.date_changed"
              :title="$t('drillcoreBox.dateChanged').toString()"
              :value="$formatDate(drillcoreBox.date_changed)"
            />
            <table-row
              :title="$t('drillcoreBox.remarks').toString()"
              :value="drillcoreBox.remarks"
            />
          </base-table>
        </v-card-text>
      </v-card>
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
import isNil from "lodash/isNil";
import type { RouteLocationRaw } from "vue-router";
import { TABS_DRILLCORE_BOX } from "~/constants";

const { $geoloogiaFetch, $hydrateTab, $translate } = useNuxtApp();
const { t } = useI18n();
const img = useImage();
const route = useRoute();
const localePath = useLocalePath();
const validRoute = ref<RouteLocationRaw>({});

const imageSizes = ["small", "medium", "large", "original"];

const drillcoreBox = computed(() => data.value?.drillcoreBox);
const activeImage = computed(() => data.value?.activeImage);
const drillcoreBoxImages = computed(() => data.value?.drillcoreBoxImages);
const drillcore = computed(() => data.value?.drillcoreBox.drillcore);

const pageTitle = computed(
  () =>
    `${t("drillcoreBox.nr", {
      number: data.value?.drillcoreBox.number,
    })} - ${$translate({
      et: data.value?.drillcoreBox.drillcore?.drillcore,
      en: data.value?.drillcoreBox.drillcore?.drillcore_en,
    })}`,
);

const drillcoresStore = useDrillcores();
const { getQueryParams } = drillcoresStore;

const { data, pending, error } = useLazyAsyncData("drillcore-box", async () => {
  const drillcoreBoxPromise = $geoloogiaFetch(
    `/drillcore_box/${route.params.id}/`,
    {
      query: {
        nest: 1,
      },
    },
  );
  const attachmentLinkPromise = $geoloogiaFetch("/attachment_link/", {
    query: {
      drillcore_box: route.params.id,
      nest: 2,
      ordering: "-attachment__is_preferred",
    },
  });

  const [drillcoreBoxResponse, attachmentLinkResponse] = await Promise.all([
    drillcoreBoxPromise,
    attachmentLinkPromise,
  ]);

  const ids = drillcoreBoxResponse?.ids;
  const drillcoreBox = drillcoreBoxResponse;
  const drillcoreBoxImages = attachmentLinkResponse.results;
  const activeImage = drillcoreBoxImages?.[0];

  const tabs = TABS_DRILLCORE_BOX.allIds.map(
    (id) => TABS_DRILLCORE_BOX.byIds[id],
  );

  return {
    ids,
    drillcoreBox,
    drillcoreBoxImages,
    activeImage,
    tabs: (!isNil(drillcoreBox?.drillcore?.locality) &&
    !isNil(drillcoreBox?.depth_start) &&
    !isNil(drillcoreBox?.depth_end)
      ? await Promise.all(
          tabs.map(
            async (tab) =>
              await $hydrateTab(tab, {
                props: {
                  locality: drillcoreBox.drillcore.locality,
                  depthStart: drillcoreBox.depth_start,
                  depthEnd: drillcoreBox.depth_end,
                },
                countParams: {
                  solr: {
                    default: {
                      fq: `locality_id:${drillcoreBox.drillcore.locality} AND (depth:[${drillcoreBox.depth_start} TO ${drillcoreBox.depth_end}] OR depth_interval:[${drillcoreBox.depth_start} TO ${drillcoreBox.depth_end}])`,
                    },
                  },
                  api: {},
                },
              }),
          ),
        )
      : tabs
    ).filter((item) => item.count > 0),
  };
});

useRedirectInvalidTabRoute({
  tabs: data.value?.tabs ?? [],
  watchableObject: data.value?.drillcoreBox,
  pending,
  validRoute: validRoute,
});

// export default defineComponent({
//   setup() {
//     useMeta(() => {
//       return {
//         title: `${pageTitle.value} | ${i18n.t('drillcoreBox.pageTitle')}`,
//         meta: [
//           {
//             property: 'og:title',
//             hid: 'og:title',
//             content: `${pageTitle.value} | ${i18n.t('drillcoreBox.pageTitle')}`,
//           },
//           {
//             property: 'og:url',
//             hid: 'og:url',
//             content: route.value.path,
//           },
//           {
//             property: 'og:image',
//             hid: 'og:image',
//             content: $img(
//               `${state.activeImage?.attachment?.uuid_filename}`,
//               { size: 'medium' },
//               {
//                 provider: 'geocollections',
//               }
//             ),
//           },
//         ],
//       }
//     })
//     return { ...toRefs(state), drillcore, pageTitle, isNull, isNil }
//   },
//   head: {},
// })
</script>
