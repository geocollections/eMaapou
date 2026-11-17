<script setup lang="ts">
import type { Analysis } from "../[id].vue";
import sortBy from "lodash/sortBy";
import sumBy from "lodash/sumBy";

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
  <div class="portal-content-margin portal-content">
    <div class="portal-row">
      <div
        class="portal-record-primary portal-column"
      >
        <table class="portal-bordered-table portal-metadata-table">
          <tbody>
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

            <TableRow
              v-if="sample"
              :title="$t('analysis.sampleNumber')"
              :value="sample"
            >
              <template #value="{ value }">
                <BaseLink
                  :to="
                    localePath({
                      name: 'sample-id',
                      params: { id: value.id },
                    })
                  "
                >
                  {{
                    value.number
                  }}
                </BaseLink>
              </template>
            </TableRow>

            <TableRow
              :title="$t('analysis.remarks')"
              :value="analysis.remarks"
            />
            <TableRow
              v-if="reference"
              :title="$t('analysis.reference')"
              :value="reference"
            >
              <template #value="{ value }">
                <BaseLinkExternal
                  :to="externalUrl(`kirjandus.geoloogia.info/reference/${value.id}`)"
                >
                  {{
                    value.reference
                  }}
                </BaseLinkExternal>
              </template>
            </TableRow>
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
            <TableRow
              v-if="sample?.locality"
              :title="$t('analysis.locality')"
              :value="sample.locality"
            >
              <template #value="{ value }">
                <BaseLink
                  :to="
                    localePath({
                      name: 'locality-id',
                      params: { id: value.id },
                    })
                  "
                >
                  {{
                    $translate({
                      et: value.name,
                      en: value.name_en,
                    })
                  }}
                </BaseLink>
              </template>
            </TableRow>
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
            <TableRow
              v-if="sample?.stratigraphy"
              :title="$t('analysis.stratigraphy')"
              :value="sample.stratigraphy"
            >
              <template #value="{ value }">
                <BaseLink
                  :to="
                    localePath({
                      name: 'stratigraphy-id',
                      params: { id: value.id },
                    })
                  "
                >
                  {{
                    $translate({
                      et: value.name,
                      en: value.name_en,
                    })
                  }}
                </BaseLink>
              </template>
            </TableRow>
            <TableRow
              v-if="sample?.lithostratigraphy"
              :title="$t('analysis.lithostratigraphy')"
              :value="sample.lithostratigraphy"
            >
              <template #value="{ value }">
                <BaseLink
                  :to="
                    localePath({
                      name: 'stratigraphy-id',
                      params: { id: value.id },
                    })
                  "
                >
                  {{
                    $translate({
                      et: value.name,
                      en: value.name_en,
                    })
                  }}
                </BaseLink>
              </template>
            </TableRow>
            <TableRow
              v-if="database"
              :title="$t('analysis.institution')"
              :value="database"
            >
              <template #value="{ value }">
                <BaseLink
                  :to="value.url"
                >
                  {{
                    $translate({
                      et: value.name,
                      en: value.name_en,
                    })
                  }}
                </BaseLink>
              </template>
            </TableRow>
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
          </tbody>
        </table>
      </div>
      <div
        v-if="resultChartData"
        class="portal-record-secondary portal-column"
      >
        <div class="block">
          <ChartAnalysisResults :data="resultChartData" />
        </div>
      </div>
    </div>
  </div>
</template>
