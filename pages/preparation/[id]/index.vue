<script setup lang="ts">
import type { Preparation } from "../[id].vue";

const props = defineProps<{ preparation: Preparation }>();

const localePath = useLocalePath();

const sample = computed(() => props.preparation.sample);
const analysis = computed(() => props.preparation.analysis);
const taxon = computed(() => props.preparation.taxon);
const agent = computed(() => props.preparation.agent);
const identificationAgent = computed(
  () => props.preparation.identification_agent,
);
const storage = computed(() => props.preparation.storage);
const owner = computed(() => props.preparation.owner);
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
            :title="$t('preparation.preparation_number')"
            :value="preparation.number"
          />

          <TableRow
            :title="$t('preparation.sample_number')"
            :value="preparation.sample_number"
          />
          <TableRowLink
            v-if="analysis"
            :title="$t('preparation.analysis')"
            :value="analysis.id"
            nuxt
            :href="
              localePath({
                name: 'analysis-id',
                params: { id: analysis.id },
              })
            "
          />
          <TableRowLink
            v-if="taxon"
            :title="$t('preparation.taxon')"
            :value="taxon.name"
            @link-click="
              $openWindow(`https://fossiilid.info/${taxon.id}`)
            "
          />
          <TableRow
            v-if="agent"
            :title="$t('preparation.agent')"
            :value="agent.name || preparation.agent_text"
          />
          <TableRow
            v-if="identificationAgent"
            :title="$t('preparation.identification_agent')"
            :value="identificationAgent.name"
          />
          <TableRow
            :title="$t('preparation.date_prepared')"
            :value="
              preparation.date_prepared || preparation.date_prepared_text
            "
          />
          <TableRow
            :title="$t('preparation.identification_date')"
            :value="preparation.identification_date"
          />
          <TableRow
            :title="$t('preparation.identification_remarks')"
            :value="preparation.identification_remarks"
          />
          <TableRow
            :title="$t('preparation.location')"
            :value="preparation.location"
          />
          <TableRow
            v-if="storage"
            :title="$t('preparation.storage')"
            :value="storage.name"
          />
          <TableRow
            v-if="owner"
            :title="$t('preparation.owner')"
            :value="owner.name"
          />
          <TableRow
            v-if="preparation.date_added"
            :title="$t('preparation.dateAdded')"
            :value="$formatDate(preparation.date_added)"
          />
          <TableRow
            v-if="preparation.date_changed"
            :title="$t('preparation.dateChanged')"
            :value="$formatDate(preparation.date_changed)"
          />
          <TableRow
            :title="$t('preparation.remarks')"
            :value="preparation.remarks"
          />
        </BaseTable>
      </VCol>
      <VCol :xl="4">
        <BaseTable class="border rounded">
          <TableRowLink
            v-if="sample"
            :title="$t('sample.number')"
            :value="
              sample.number
                || sample.number_additional
                || sample.number_field
                || sample.id
            "
            nuxt
            :href="
              localePath({
                name: 'sample-id',
                params: { id: sample.id },
              })
            "
          />
          <TableRow
            :title="$t('sample.depth')"
            :value="sample?.depth"
          />
          <TableRow
            :title="$t('sample.depthInterval')"
            :value="sample?.depth_interval"
          />
          <TableRow
            :title="$t('sample.dateCollected')"
            :value="sample?.date_collected || sample?.date_collected_text"
          />
        </BaseTable>
      </VCol>
    </VRow>
  </VContainer>
</template>
