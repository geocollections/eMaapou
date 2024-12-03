<script setup lang="ts">
import type { Sample } from "../[id].vue";

const props = defineProps<{ sampleObject: Sample }>();

const { t } = useI18n();
const route = useRoute();
const { $apiFetch } = useNuxtApp();

const chartTitle = computed(() => {
  return `${t("sample.number")} ${
    props.sampleObject?.number
    || props.sampleObject?.number_additional
    || props.sampleObject?.number_field
    || props.sampleObject?.id
  }`;
});

const { data: taxons } = await useAsyncData("taxons", async () => {
  const resultsResponse = await $apiFetch<GeoloogiaListResponse>(`/samples/${route.params.id}/sample-taxa/`, {
    query: {
      fields: "id,name,taxon.name,frequency",
      offset: 0,
      limit: 1000,
    },
  });
  return resultsResponse.results.map((item: any) => {
    return {
      value: item.frequency,
      name: item.taxon?.name ?? item.name,
    };
  });
}, {
  default: () => [],
});
</script>

<template>
  <ChartTaxonPie
    table-key="sample"
    :table-id="route.params.id!.toString()"
    :chart-title="chartTitle"
    :taxon-data="taxons"
  />
</template>
