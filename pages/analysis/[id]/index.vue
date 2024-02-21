<template>
  <v-container style="margin: initial">
    <v-row>
      <v-col :sm="12" :md="6" :lg="7" :xl="5">
        <v-card>
          <base-table>
            <table-row
              v-if="analysisMethod"
              :title="$t('analysis.method')"
              :value="
                $translate({
                  et: analysisMethod.analysis_method,
                  en: analysisMethod.method_en,
                })
              "
            />
            <table-row
              v-if="agent"
              :title="$t('analysis.analysedBy')"
              :value="agent.agent"
            />

            <table-row-link
              v-if="sample"
              :title="$t('analysis.sampleNumber')"
              :value="sample.number"
              nuxt
              :href="
                localePath({
                  name: 'sample-id',
                  params: { id: analysis.sample.id },
                })
              "
            />

            <table-row
              :title="$t('analysis.remarks')"
              :value="analysis.remarks"
            />
            <table-row-link
              v-if="reference"
              :title="$t('analysis.reference')"
              :value="reference.reference"
              @link-click="$openGeology('reference', reference.id)"
            />
            <table-row
              v-if="dataset"
              :title="$t('analysis.dataset')"
              :value="
                $translate({
                  et: dataset.name,
                  en: dataset.name_en,
                })
              "
            />
            <table-row-link
              v-if="sample && sample.locality"
              :title="$t('analysis.locality')"
              :value="
                $translate({
                  et: sample.locality.locality,
                  en: sample.locality.locality_en,
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
            <table-row
              v-if="sample"
              :title="$t('analysis.depth')"
              :value="sample.depth"
            />
            <table-row
              v-if="sample"
              :title="$t('analysis.depthInterval')"
              :value="sample.depth_interval"
            />
            <table-row-link
              v-if="sample && sample.stratigraphy"
              :title="$t('analysis.stratigraphy')"
              :value="
                $translate({
                  et: sample.stratigraphy.stratigraphy,
                  en: sample.stratigraphy.stratigraphy_en,
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
            <table-row-link
              v-if="sample && sample.lithostratigraphy"
              :title="$t('analysis.lithostratigraphy')"
              :value="
                $translate({
                  et: sample.lithostratigraphy.stratigraphy,
                  en: sample.lithostratigraphy.stratigraphy_en,
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
            <table-row-link
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

            <table-row
              v-if="analysis.date_added"
              :title="$t('analysis.dateAdded')"
              :value="$formatDate(analysis.date_added)"
            />
            <table-row
              v-if="analysis.date_changed"
              :title="$t('analysis.dateChanged')"
              :value="$formatDate(analysis.date_changed)"
            />
          </base-table>
        </v-card>
      </v-col>
      <v-col v-if="resultChartData" :md="6" :lg="5" :xl="4">
        <div class="d-block">
          <chart-analysis-results :data="resultChartData" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import sumBy from "lodash/sumBy";
import sortBy from "lodash/sortBy";

const props = defineProps<{
  analysis: any;
}>();
console.log(props.analysis);

const resultChartData = computed(() => data.value?.resultChartData);
const database = computed(() => props.analysis.database);
const analysisMethod = computed(() => props.analysis.analysis_method ?? "");
const sample = computed(() => props.analysis.sample);
const agent = computed(() => props.analysis.agent);
const reference = computed(() => props.analysis.reference);
const dataset = computed(() => props.analysis.dataset);

const { $solrFetch } = useNuxtApp();
const route = useRoute();
const { data } = await useAsyncData("results", async () => {
  const analysisResultResponse = await $solrFetch("/analysis_results", {
    query: {
      q: `analysis_id:${route.params.id}`,
      group: true,
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
      if (unitKey === "6") {
        results.push({ name: "Other", value: 100 - valueSum });
      }
      // if (unitKey === '7') {
      //   results.push({ name: 'Other', value: 1000000 - valueSum })
      // }

      return {
        ...prev,
        [unitKey]: sortBy(results, "value"),
      };
    }, {});
  return {
    resultChartData,
  };
});
</script>
