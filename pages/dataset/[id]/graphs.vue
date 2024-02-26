<script setup lang="ts">
const props = defineProps({
  dataset: {
    type: Object,
    required: true,
  },
});

const analysisResults = ref([]);
const sampleResults = ref([]);
const minDepth = ref(0);
const maxDepth = ref(0);
const reversed = ref(false);
const parameters = ref([]);

const { $solrFetch } = useNuxtApp();
const route = useRoute();

const { pending } = await useLazyAsyncData("data", async () => {
  const analysisResultsPromise = $solrFetch("/analysis_results", {
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
  const samplesPromise = $solrFetch("/sample_data", {
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

  // TODO: catch any failing promises
  const [analysisResultsResponse, sampleResponse] = await Promise.all([
    analysisResultsPromise,
    samplesPromise,
  ]);

  const _analysisResults = analysisResultsResponse?.response.docs;
  const _sampleResults = sampleResponse?.response.docs;

  const [_maxDepth, _minDepth, _reversed] = chartRange(
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
  const _parameters = flogParameters(
    analysisResultsResponse.facet_counts.facet_pivot,
  );

  analysisResults.value = _analysisResults;
  sampleResults.value = _sampleResults;
  minDepth.value = _minDepth;
  maxDepth.value = _maxDepth;
  reversed.value = _reversed;
  parameters.value = _parameters;
});

const title = computed(() => props.dataset?.title);
</script>

<template>
  <div>
    <ChartFlog
      v-if="analysisResults.length > 0 && sampleResults.length > 0"
      :analyses="analysisResults"
      :samples="sampleResults"
      :min-depth="minDepth"
      :max-depth="maxDepth"
      :parameters="parameters"
      :title="dataset.title"
      :reverse="reversed"
    />
  </div>
</template>
