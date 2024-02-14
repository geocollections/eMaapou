<template>
  <chart-taxon-pie
    table-key="sample"
    :table-id="$route.params.id.toString()"
    :chart-title="chartTitle"
    :taxon-data="taxons"
  />
</template>

<script setup lang="ts">
const props = defineProps({
  sampleObject: {
    type: Object,
    default: () => {},
  },
});

const { t } = useI18n();
const route = useRoute();
const { $geoloogiaFetch } = useNuxtApp();

const chartTitle = computed(() => {
  return `${t("sample.number")} ${
    props.sampleObject?.number ||
    props.sampleObject?.number_additional ||
    props.sampleObject?.number_field ||
    props.sampleObject?.id
  }`;
});

const { data: taxons } = useAsyncData("taxons", async () => {
  const resultsResponse = await $geoloogiaFetch("/taxon_list/", {
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
});
</script>
