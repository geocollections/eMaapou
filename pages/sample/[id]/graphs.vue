<script setup lang="ts">
import type { Sample } from "../[id].vue";

const props = defineProps<{ sampleObject: Sample }>();

const { t } = useI18n();
const route = useRoute();
const { $geoloogiaFetch } = useNuxtApp();

const chartTitle = computed(() => {
  return `${t("sample.number")} ${
    props.sampleObject?.number
    || props.sampleObject?.number_additional
    || props.sampleObject?.number_field
    || props.sampleObject?.id
  }`;
});

const { data: taxons } = await useAsyncData("taxons", async () => {
  const resultsResponse = await $geoloogiaFetch<GeoloogiaListResponse>("/taxon_list/", {
    query: {
      sample: route.params.id,
      fields: "id,name,taxon,frequency",
      nest: 1,
      offset: 0,
      limit: 1000,
    },
  });
  return resultsResponse.results.map((item: any) => {
    return {
      value: item.frequency,
      name: item.taxon?.taxon ?? item.name,
    };
  });
}, {
  default: () => [],
});
</script>

<template>
  <ChartTaxonPie
    table-key="sample"
    :table-id="$route.params.id.toString()"
    :chart-title="chartTitle"
    :taxon-data="taxons"
  />
</template>
