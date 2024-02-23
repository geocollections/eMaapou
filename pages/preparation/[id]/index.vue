<script setup lang="ts">
const props = defineProps<{ preparation: any }>();

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
  <v-container style="margin: initial">
    <v-row>
      <v-col
        :sm="12"
        :md="6"
        :lg="7"
        :xl="5"
      >
        <v-card>
          <base-table>
            <table-row
              :title="$t('preparation.preparation_number')"
              :value="preparation.preparation_number"
            />

            <table-row
              :title="$t('preparation.sample_number')"
              :value="preparation.sample_number"
            />
            <table-row-link
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
            <table-row-link
              v-if="taxon"
              :title="$t('preparation.taxon')"
              :value="taxon.taxon"
              @link-click="
                $openWindow(`https://fossiilid.info/${preparation.taxon.id}`)
              "
            />
            <table-row
              v-if="agent"
              :title="$t('preparation.agent')"
              :value="agent.agent || preparation.agent_txt"
            />
            <table-row
              v-if="identificationAgent"
              :title="$t('preparation.identification_agent')"
              :value="identificationAgent.agent"
            />
            <table-row
              :title="$t('preparation.date_prepared')"
              :value="
                preparation.date_prepared || preparation.date_prepared_txt
              "
            />
            <table-row
              :title="$t('preparation.identification_date')"
              :value="preparation.identification_date"
            />
            <table-row
              :title="$t('preparation.identification_remarks')"
              :value="preparation.identification_remarks"
            />
            <table-row
              :title="$t('preparation.location')"
              :value="preparation.location"
            />
            <table-row
              v-if="storage"
              :title="$t('preparation.storage')"
              :value="storage.location"
            />
            <table-row
              v-if="owner"
              :title="$t('preparation.owner')"
              :value="owner.agent"
            />
            <table-row
              v-if="preparation.date_added"
              :title="$t('preparation.dateAdded')"
              :value="$formatDate(preparation.date_added)"
            />
            <table-row
              v-if="preparation.date_changed"
              :title="$t('preparation.dateChanged')"
              :value="$formatDate(preparation.date_changed)"
            />
            <table-row
              :title="$t('preparation.remarks')"
              :value="preparation.remarks"
            />
          </base-table>
        </v-card>
      </v-col>
      <v-col :xl="4">
        <v-card>
          <base-table>
            <table-row-link
              v-if="sample"
              :title="$t('sample.number').toString()"
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
            <table-row
              :title="$t('sample.depth').toString()"
              :value="sample.depth"
            />
            <table-row
              :title="$t('sample.depthInterval').toString()"
              :value="sample.depth_interval"
            />
            <table-row
              :title="$t('sample.dateCollected').toString()"
              :value="sample.date_collected || sample.date_collected_free"
            />
          </base-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
