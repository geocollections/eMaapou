<script setup lang="ts">
import sumBy from "lodash/sumBy";
import sortBy from "lodash/sortBy";
import type { Analysis } from "../[id].vue";

const props = defineProps<{
  analysis: Analysis;
}>();

const database = computed(() => props.analysis.database);
const analysisMethod = computed(() => props.analysis.analysis_method);
const sample = computed(() => props.analysis.sample);
const analyst = computed(() => props.analysis.analyst);
const reference = computed(() => props.analysis.reference);
const dataset = computed(() => props.analysis.dataset);

const { $solrFetch } = useNuxtApp();
const localePath = useLocalePath();
const route = useRoute();
const { data } = await useAsyncData("results", async () => {
  const analysisResultResponse = await $solrFetch<any>("/analysis_results", {
    query: {
      "q": `analysis_id:${route.params.id}`,
      "group": true,
      "group.field": "unit_id",
      "group.sort": "value desc",
      "group.limit": 100,
    },
  });
  const resultChartData = analysisResultResponse.grouped.unit_id.groups
    .map((group: any) => [group.groupValue, group.doclist.docs])
    .reduce((prev: any, [unitKey, unitResults]: any) => {
      const results = unitResults
        .filter((result: any) => result.value && result.value >= 0)
        .map((result: any) => {
          return {
            name: result.parameter,
            value: result.value,
          };
        });

      const valueSum = sumBy(results, "value");
      if (unitKey === "6")
        results.push({ name: "Other", value: 100 - valueSum });

      return {
        ...prev,
        [unitKey]: sortBy(results, "value"),
      };
    }, {});
  return {
    resultChartData,
  };
});

const resultChartData = computed(() => data.value?.resultChartData);
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
            v-if="analysisMethod"
            :title="$t('analysis.method')"
            :value="
              $translate({
                et: analysisMethod.name,
                en: analysisMethod.name_en,
              })
            "
          />
          <TableRow
            v-if="analyst"
            :title="$t('analysis.analysedBy')"
            :value="analyst.name"
          />

          <TableRowLink
            v-if="sample"
            :title="$t('analysis.sampleNumber')"
            :value="sample.number"
            nuxt
            :href="
              localePath({
                name: 'sample-id',
                params: { id: sample.id },
              })
            "
          />

          <TableRow
            :title="$t('analysis.remarks')"
            :value="analysis.remarks"
          />
          <TableRowLink
            v-if="reference"
            :title="$t('analysis.reference')"
            :value="reference.reference"
            @link-click="$openGeology('reference', reference.id.toString())"
          />
          <TableRow
            v-if="dataset"
            :title="$t('analysis.dataset')"
            :value="
              $translate({
                et: dataset.name,
                en: dataset.name_en,
              })
            "
          />
          <TableRowLink
            v-if="sample && sample.locality"
            :title="$t('analysis.locality')"
            :value="
              $translate({
                et: sample.locality.name,
                en: sample.locality.name_en,
              })
            "
            nuxt
            :href="
              localePath({
                name: 'locality-id',
                params: { id: sample.locality.id },
              })
            "
          />
          <TableRow
            v-if="sample"
            :title="$t('analysis.depth')"
            :value="sample.depth"
          />
          <TableRow
            v-if="sample"
            :title="$t('analysis.depthInterval')"
            :value="sample.depth_interval"
          />
          <TableRowLink
            v-if="sample && sample.stratigraphy"
            :title="$t('analysis.stratigraphy')"
            :value="
              $translate({
                et: sample.stratigraphy.name,
                en: sample.stratigraphy.name_en,
              })
            "
            nuxt
            :href="
              localePath({
                name: 'stratigraphy-id',
                params: { id: sample.stratigraphy.id },
              })
            "
          />
          <TableRowLink
            v-if="sample && sample.lithostratigraphy"
            :title="$t('analysis.lithostratigraphy')"
            :value="
              $translate({
                et: sample.lithostratigraphy.name,
                en: sample.lithostratigraphy.name_en,
              })
            "
            nuxt
            :href="
              localePath({
                name: 'stratigraphy-id',
                params: { id: sample.lithostratigraphy.id },
              })
            "
          />
          <TableRowLink
            v-if="database"
            :title="$t('analysis.institution')"
            :value="
              $translate({
                et: database.name,
                en: database.name_en,
              })
            "
            :href="database.url"
            target="DatabaseWindow"
          />

          <TableRow
            v-if="analysis.date_added"
            :title="$t('analysis.dateAdded')"
            :value="$formatDate(analysis.date_added)"
          />
          <TableRow
            v-if="analysis.date_changed"
            :title="$t('analysis.dateChanged')"
            :value="$formatDate(analysis.date_changed)"
          />
        </BaseTable>
      </VCol>
      <VCol
        v-if="resultChartData"
        :md="6"
        :lg="5"
        :xl="4"
      >
        <div class="d-block">
          <ChartAnalysisResults :data="resultChartData" />
        </div>
      </VCol>
    </VRow>
  </VContainer>
</template>
