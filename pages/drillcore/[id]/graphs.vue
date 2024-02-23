<script setup lang="ts">
const props = defineProps({
  locality: { type: Number, required: true },
  drillcoreObject: {
    type: Object,
    required: true,
  },
  attachment: {
    type: String,
    required: false,
    default: "",
  },
});

const lasContent = ref<string | null>(null);
const analysisResults = ref<any[]>([]);
const sampleResults = ref<any[]>([]);
const minDepth = ref<number>(0);
const maxDepth = ref<number>(0);
const parameters = ref<any[]>([]);
const reversed = ref<boolean>(false);
const { $translate, $geoloogiaFetch, $solrFetch } = useNuxtApp();

await useLazyAsyncData("data", async () => {
  let rawLasFileContent;
  if (props.attachment) {
    const rawLasfileContentResponse = await $geoloogiaFetch(
      `/file/${props.attachment}/`,
      {
        query: {
          raw_content: "true",
        },
      },
    );

    rawLasFileContent = rawLasfileContentResponse;
    if (
      typeof rawLasfileContentResponse === "string"
      && rawLasFileContent.startsWith("Error: ")
    )
      rawLasFileContent = "";
    lasContent.value = rawLasFileContent;
  }

  const analysisResultsPromise = $solrFetch("/analysis_results", {
    query: {
      "q": "*",
      "fq": `locality_id:${props.locality}`,
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
      "fq": `locality_id:${props.locality} AND (depth:[* TO *] OR depth_interval:[* TO *])`,
      "start": 0,
      "rows": 50000,
      "fl": "id,sample_id,sample_number,depth,depth_interval,",
      "sort": "depth asc",
      "stats": "on",
      "stats.field": ["depth", "depth_interval"],
    },
  });
  const taxaPromise = $solrFetch("/taxon_frequency", {
    query: {
      "q": "*",
      "fq": `locality_id:${props.locality} AND (depth:[* TO *] OR depth_interval:[* TO *]) AND frequency:[0 TO *]`,
      "start": 0,
      "rows": 50000,
      "fl": "depth,depth_interval,frequency,taxon,taxon_id,",
      "sort": "depth asc",
      "stats": "on",
      "stats.field": ["taxon", "depth"],
      "stats.calcdistinct": true,
    },
  });

  // TODO: catch any failing promises
  const [analysisResultsResponse, sampleResponse, taxaResponse]
    = await Promise.all([analysisResultsPromise, samplesPromise, taxaPromise]);

  analysisResults.value = analysisResultsResponse?.response.docs;
  sampleResults.value = sampleResponse?.response.docs;
  taxaResults.value = taxaResponse?.response.docs;

  const [_maxDepth, _minDepth, _reversed] = chartRange(
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
  const _parameters = flogParameters(
    analysisResultsResponse.facet_counts.facet_pivot,
  );
  maxDepth.value = _maxDepth;
  minDepth.value = _minDepth;
  parameters.value = _parameters;
  reversed.value = _reversed;
});
const chartTitle = computed(() => {
  return $translate({
    et: props.drillcoreObject?.drillcore,
    en: props.drillcoreObject?.drillcore_en,
  });
});
</script>

<template>
  <div>
    <chart-flog
      v-if="analysisResults.length > 0 && sampleResults.length > 0"
      :analyses="analysisResults"
      :samples="sampleResults"
      :min-depth="minDepth"
      :max-depth="maxDepth"
      :parameters="parameters"
      :title="
        $translate({
          et: drillcoreObject.drillcore,
          en: drillcoreObject.drillcore_en,
        })
      "
      :reverse="reversed"
    />

    <chart-las
      v-if="attachment && lasContent"
      class="pa-2"
      :class="{
        'pt-4': analysisResults.length > 0 && sampleResults.length > 0,
      }"
      :chart-title="chartTitle"
      :file-data="lasContent"
    />
  </div>
</template>
