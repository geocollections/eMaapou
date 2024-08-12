<script setup lang="ts">
import type { Dataset } from "../[id].vue";

defineProps<{ dataset: Dataset }>();

const { $solrFetch } = useNuxtApp();
const route = useRoute();

const { data } = await useLazyAsyncData("data", async () => {
  const analysisResultsPromise = $solrFetch<any>("/analysis_results", {
    query: {
      "q": "*",
      "fq": `dataset_ids:${route.params.id}`,
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
  const samplesPromise = $solrFetch<any>("/sample_data", {
    query: {
      "q": "*",
      "fq": `dataset_ids:${route.params.id} AND (depth:[* TO *] OR depth_interval:[* TO *])`,
      "start": 0,
      "rows": 50000,
      "fl": "id,sample_id,sample_number,depth,depth_interval,",
      "sort": "depth asc",
      "stats": "on",
      "stats.field": ["depth", "depth_interval"],
    },
  });

  const [analysisResultsResponse, sampleResponse] = await Promise.all([
    analysisResultsPromise,
    samplesPromise,
  ]);

  const [maxDepth, minDepth, reversed] = chartRange(
    [
      analysisResultsResponse.stats.stats_fields.depth.max,
      sampleResponse.stats.stats_fields.depth.max,
      sampleResponse.stats.stats_fields.depth_interval.max,
    ],
    [
      analysisResultsResponse.stats.stats_fields.depth.min,
      sampleResponse.stats.stats_fields.depth.min,
      sampleResponse.stats.stats_fields.depth_interval.min,
    ],
  );
  const parameters = flogParameters(
    analysisResultsResponse.facet_counts.facet_pivot,
  );

  return {
    analysisResults: analysisResultsResponse.response.docs,
    sampleResults: sampleResponse.response.docs,
    minDepth,
    maxDepth,
    parameters,
    reversed,
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
  }),
});
</script>

<template>
  <div>
    <ChartFlog
      v-if="data.analysisResults.length > 0 && data.sampleResults.length > 0"
      :analyses="data.analysisResults"
      :samples="data.sampleResults"
      :min-depth="data.minDepth"
      :max-depth="data.maxDepth"
      :parameters="data.parameters"
      :title="dataset.title"
      :reverse="data.reversed"
    />
  </div>
</template>
