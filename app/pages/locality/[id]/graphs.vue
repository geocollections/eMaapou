<script setup lang="ts">
import type { Locality } from "../[id].vue";
// @ts-expect-error add types
import { las2json } from "wellio";

const props = withDefaults(defineProps<{
  localityObject: Locality;
  attachment?: string;
}>(), {
  attachment: "",
});

const { $translate, $solrFetch } = useNuxtApp();

const route = useRoute();

const { data } = await useLazyAsyncData("data", async () => {
  let rawLasFileContent;
  let lasContent: { [K: string]: any } | null = null;
  if (props.attachment) {
    const rawLasfileContentResponse = await $fetch<any>(
      `https://files.geocollections.info/${props.attachment}`,
    );

    rawLasFileContent = await rawLasfileContentResponse.text();
    rawLasFileContent = las2json(rawLasFileContent);
    if (
      typeof rawLasfileContentResponse === "string"
      && rawLasFileContent.startsWith("Error: ")
    ) {
      rawLasFileContent = "";
    }
    lasContent = rawLasFileContent;
  }

  const analysisResultsPromise = $solrFetch<SolrResponse & { stats: any; facet_counts: any }>("/analysis_results", {
    query: {
      "q": "*",
      "fq": `locality_id:${route.params.id}`,
      "start": 0,
      "rows": 50000,
      "fl": "id,analysis_id,depth,depth_interval,parameter,method_id,value",
      "sort": "depth asc",
      "stats": "on",
      "stats.field": ["depth"],
      "facet": "on",
      "facet.pivot": [
        "method_id,analysis_method,analysis_method_en",
        "method_id,parameter_id,parameter",
      ],
    },
  });
  const samplesPromise = $solrFetch<SolrResponse & { stats: any }>("/sample_data", {
    query: {
      "q": "*",
      "fq": `locality_id:${route.params.id} AND (depth:[* TO *] OR depth_interval:[* TO *])`,
      "start": 0,
      "rows": 50000,
      "fl": "id,sample_id,sample_number,depth,depth_interval,",
      "sort": "depth asc",
      "stats": "on",
      "stats.field": ["depth", "depth_interval"],
    },
  });
  const taxaPromise = $solrFetch<SolrResponse & { stats: any }>("/taxon_frequency", {
    query: {
      "q": "*",
      "fq": `locality_id:${route.params.id} AND (depth:[* TO *] OR depth_interval:[* TO *]) AND frequency:[0 TO *]`,
      "start": 0,
      "rows": 50000,
      "fl": "depth,depth_interval,frequency,taxon,taxon_id,",
      "sort": "depth asc",
      "stats": "on",
      "stats.field": ["taxon", "depth"],
      "stats.calcdistinct": true,
    },
  });

  const [analysisResultsResponse, sampleResponse, taxaResponse]
    = await Promise.all([analysisResultsPromise, samplesPromise, taxaPromise]);

  const [maxDepth, minDepth, reversed] = chartRange(
    [
      analysisResultsResponse.stats.stats_fields.depth.max,
      sampleResponse.stats.stats_fields.depth.max,
      sampleResponse.stats.stats_fields.depth_interval.max,
      taxaResponse.stats.stats_fields.depth.max,
    ],
    [
      analysisResultsResponse.stats.stats_fields.depth.min,
      sampleResponse.stats.stats_fields.depth.min,
      sampleResponse.stats.stats_fields.depth_interval.min,
      taxaResponse.stats.stats_fields.depth.min,
    ],
  );
  const parameters = flogParameters(
    analysisResultsResponse.facet_counts.facet_pivot,
  );

  return {
    analysisResults: analysisResultsResponse.response.docs,
    sampleResults: sampleResponse.response.docs,
    taxaResults: taxaResponse.response.docs,
    minDepth,
    maxDepth,
    parameters,
    reversed,
    lasContent,
  };
}, {
  default: () => ({
    analysisResults: [],
    sampleResults: [],
    taxaResults: [],
    minDepth: 0,
    maxDepth: 0,
    parameters: [],
    reversed: false,
    lasContent: null,
  }),
});

const chartTitle = computed(() => {
  return $translate({
    et: props.localityObject?.name,
    en: props.localityObject?.name_en,
  });
});
</script>

<template>
  <div>
    <ChartFlog
      v-if="data.analysisResults.length > 0 && data.sampleResults.length > 0"
      :analyses="data.analysisResults"
      :samples="data.sampleResults"
      :taxa="data.taxaResults"
      :min-depth="data.minDepth"
      :max-depth="data.maxDepth"
      :parameters="data.parameters"
      :title="
        $translate({
          et: localityObject.name,
          en: localityObject.name_en,
        })
      "
      :reverse="data.reversed"
    />
    <ChartLas
      v-if="attachment && data.lasContent"
      class="pa-2"
      :class="{
        'pt-4': data.analysisResults.length > 0 && data.sampleResults.length > 0,
      }"
      :chart-title="chartTitle"
      :file-data="data.lasContent"
    />
  </div>
</template>
