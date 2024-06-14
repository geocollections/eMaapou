<script setup lang="ts">
import type { Stratigraphy } from "../[id].vue";

defineProps<{
  stratigraphy: Stratigraphy;
}>();

const localePath = useLocalePath();
const route = useRoute();

const {
  options,
  headers,
  sortBy,
} = useDataTableGeoloogiaApi({
  initOptions: STRATOTYPE.options,
  initHeaders: HEADERS_STRATIGRAPHY_STRATOTYPE,
});
const { $translate, $geoloogiaFetch } = useNuxtApp();
const { data } = await useAsyncData("detail", async () => {
  const stratotypesRes = await $geoloogiaFetch<any>(`/stratigraphy_stratotype/`, {
    query: {
      stratigraphy: route.params.id,
      nest: 2,
      ordering: sortBy.value,
    },
  });
  return {
    stratotypes: stratotypesRes.results,
    stratotypeCount: stratotypesRes.count,
  };
}, {
  default: () => ({
    stratotypes: [],
    stratotypeCount: 0,
  }),
});
const stratigraphyMarkers = computed((): MapMarker[] => {
  return data.value.stratotypes?.reduce((prev: MapMarker[], stratotype: any) => {
    if (stratotype.locality) {
      prev.push({
        latitude: stratotype?.locality?.latitude,
        longitude: stratotype?.locality?.longitude,
        text: `${$translate({
              et: stratotype?.locality?.locality,
              en: stratotype?.locality?.locality_en,
            })} (${$translate({
              et: stratotype?.stratotype_type?.value,
              en: stratotype?.stratotype_type?.value_en,
            })})`,
      });
    }
    return prev;
  }, [] as MapMarker[]);
});
const mapIsEstonian = computed(() => {
  return data.value.stratotypes.some(
    (item: any) => item?.locality?.country?.value_en === "Estonia",
  );
});

const mapBaseLayer = computed(() => {
  if (mapIsEstonian.value)
    return "Estonian map";

  return "OpenStreetMap";
});

const mapOverlays = computed(() => {
  if (mapIsEstonian.value)
    return ["Estonian bedrock" as const];
  return undefined;
});
</script>

<template>
  <VContainer style="margin: initial">
    <VRow>
      <VCol
        :sm="12"
        :md="6"
        :lg="7"
        :xl="5"
      >
        <BaseTable class="border rounded">
          <TableRow
            v-if="stratigraphy.parent"
            :title="$t('stratigraphy.parentStratigraphy')"
            :value="stratigraphy.parent"
          >
            <template #value="{ value: parent }">
              <BaseLink
                :to="
                  localePath({
                    name: 'stratigraphy-id',
                    params: { id: parent.id },
                  })
                "
              >
                {{
                  $translate({
                    et: parent.name,
                    en: parent.name_en,
                  })
                }}
              </BaseLink>
            </template>
          </TableRow>
          <TableRow
            v-if="stratigraphy.type"
            :title="$t('stratigraphy.type')"
            :value="
              $translate({
                et: stratigraphy.type.value,
                en: stratigraphy.type.value_en,
              })
            "
          />
          <TableRow
            v-if="stratigraphy.rank"
            :title="$t('stratigraphy.rank')"
            :value="
              $translate({
                et: stratigraphy.rank.value,
                en: stratigraphy.rank.value_en,
              })
            "
          />
          <TableRow
            v-if="stratigraphy.original_rank"
            :title="$t('stratigraphy.originalRank')"
            :value="stratigraphy.original_rank"
          />
          <TableRow
            v-if="stratigraphy.scope"
            :title="$t('stratigraphy.scope')"
            :value="
              $translate({
                et: stratigraphy.scope.value,
                en: stratigraphy.scope.value_en,
              })
            "
          />
          <TableRow
            v-if="stratigraphy.status"
            :title="$t('stratigraphy.status')"
            :value="
              $translate({
                et: stratigraphy.status.value,
                en: stratigraphy.status.value_en,
              })
            "
          />
          <TableRow
            :title="$t('stratigraphy.author')"
            :value="stratigraphy.author_text"
          />
          <TableRow
            :title="$t('stratigraphy.year')"
            :value="stratigraphy.year"
          />
          <TableRow
            v-if="stratigraphy.etymon || stratigraphy.etymon_en"
            :title="$t('stratigraphy.etymon')"
            :value="
              $translate({
                et: stratigraphy.etymon ?? '',
                en: stratigraphy.etymon_en ?? '',
              })
            "
          />
          <TableRow
            :title="$t('stratigraphy.originalLocality')"
            :value="stratigraphy.original_locality"
          />
          <TableRow
            :title="$t('stratigraphy.ageTop')"
            :value="stratigraphy.age_top"
          />
          <TableRow
            :title="$t('stratigraphy.ageBase')"
            :value="stratigraphy.age_base"
          />
          <TableRow
            v-if="stratigraphy.age_chronostratigraphy"
            :title="$t('stratigraphy.age')"
            :value="stratigraphy.age_chronostratigraphy"
          >
            <template #value="{ value: chronostratigraphy }">
              <BaseLink
                :to="
                  localePath({
                    name: 'stratigraphy-id',
                    params: { id: chronostratigraphy.id },
                  })
                "
              >
                {{
                  $translate({
                    et: chronostratigraphy.name,
                    en: chronostratigraphy.name_en,
                  })
                }}
              </BaseLink>
            </template>
          </TableRow>
          <TableRow
            v-if="stratigraphy.age_reference"
            :title="$t('stratigraphy.ageReference')"
            :value="stratigraphy.age_reference.reference"
          />

          <TableRow
            v-if="stratigraphy.index_html"
            :title="$t('stratigraphy.index')"
            :value="stratigraphy.index_html"
          >
            <template #value="{ value }">
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div v-html="value" />
            </template>
          </TableRow>
          <TableRow
            v-if="stratigraphy.index_additional_html"
            :title="$t('stratigraphy.indexAlt')"
            :value="stratigraphy.index_additional_html"
          >
            <template #value="{ value }">
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div v-html="value" />
            </template>
          </TableRow>
          <TableRow
            v-if="stratigraphy.index_old"
            :title="$t('stratigraphy.indexAlt')"
            :value="stratigraphy.index_old"
          />
          <TableRow
            v-if="stratigraphy.date_added"
            :title="$t('stratigraphy.dateAdded')"
            :value="$formatDate(stratigraphy.date_added)"
          />
          <TableRow
            v-if="stratigraphy.date_changed"
            :title="$t('stratigraphy.dateChanged')"
            :value="$formatDate(stratigraphy.date_changed)"
          />
        </BaseTable>
      </VCol>
      <VCol
        v-if="data.stratotypeCount > 0 || stratigraphyMarkers.length > 0"
        :md="6"
        :lg="5"
        :xl="4"
      >
        <DataTableStratigraphyStratotype
          v-if="data.stratotypeCount > 0"
          class="border rounded mb-2"
          only-table
          :items="data.stratotypes"
          :count="data.stratotypeCount"
          :options="options"
          :headers="headers"
          :is-loading="false"
        />
        <MapDetail
          v-if="stratigraphyMarkers.length > 0"
          rounded
          :base-layer="mapBaseLayer"
          :overlays="mapOverlays"
          height="300px"
          :markers="stratigraphyMarkers"
        />
      </VCol>
    </VRow>
  </VContainer>
</template>
