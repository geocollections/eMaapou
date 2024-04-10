<script setup lang="ts">
const props = defineProps<{
  stratigraphy: any;
}>();

const localePath = useLocalePath();
const route = useRoute();

const {
  options,
  headers,
} = useDataTableDetail({
  initOptions: STRATOTYPE.options,
  initHeaders: HEADERS_STRATIGRAPHY_STRATOTYPE,
});
const { $translate, $geoloogiaFetch } = useNuxtApp();
const { data } = await useAsyncData("detail", async () => {
  const stratotypesRes = await $geoloogiaFetch<any>(`/stratigraphy_stratotype/`, {
    query: {
      stratigraphy: route.params.id,
      nest: 2,
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
  return data.value.stratotypes?.reduce((prev, stratotype) => {
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
  }, []);
});
const mapIsEstonian = computed(() => {
  return data.value.stratotypes.some(
    item => item?.locality?.country?.value_en === "Estonia",
  );
});

const mapBaseLayer = computed(() => {
  if (mapIsEstonian.value)
    return "Estonian map";

  return "OpenStreetMap";
});

const mapOverlays = computed(() => {
  if (mapIsEstonian.value)
    return ["Estonian bedrock"];

  return [];
});

const stratotypeOptions = ref(STRATOTYPE.options);
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
          <TableRowLink
            v-if="stratigraphy.parent"
            :title="$t('stratigraphy.parentStratigraphy')"
            :value="
              $translate({
                et: stratigraphy.parent.stratigraphy,
                en: stratigraphy.parent.stratigraphy_en,
              })
            "
            nuxt
            :href="
              localePath({
                name: 'stratigraphy-id',
                params: { id: stratigraphy.parent.id },
              })
            "
          />
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
            :value="stratigraphy.author_free"
          />
          <TableRow
            :title="$t('stratigraphy.year')"
            :value="stratigraphy.year"
          />
          <TableRow
            :title="$t('stratigraphy.etymon')"
            :value="
              $translate({
                et: stratigraphy.etymon,
                en: stratigraphy.etymon_en,
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
          <TableRowLink
            v-if="stratigraphy.age_chronostratigraphy"
            :title="$t('stratigraphy.age')"
            :value="
              $translate({
                et: stratigraphy.age_chronostratigraphy.stratigraphy,
                en: stratigraphy.age_chronostratigraphy.stratigraphy_en,
              })
            "
            nuxt
            :href="
              localePath({
                name: 'stratigraphy-id',
                params: {
                  id: stratigraphy.age_chronostratigraphy.id,
                },
              })
            "
          />
          <TableRow
            v-if="stratigraphy.age_reference"
            :title="$t('stratigraphy.ageReference')"
            :value="stratigraphy.age_reference.reference"
          />

          <TableRow
            v-if="stratigraphy.index_main_html"
            :title="$t('stratigraphy.index')"
          >
            <template #value>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div v-html="stratigraphy.index_main_html" />
            </template>
          </TableRow>
          <TableRow
            v-if="stratigraphy.index_additional_html"
            :title="$t('stratigraphy.indexAlt')"
          >
            <template #value>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div v-html="stratigraphy.index_additional_html" />
            </template>
          </TableRow>
          <TableRow
            v-if="stratigraphy.index_old"
            :title="$t('stratigraphy.indexAlt')"
          >
            <template #value>
              <div v-text="stratigraphy.index_old" />
            </template>
          </TableRow>
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
