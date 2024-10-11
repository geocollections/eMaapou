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

const preparationImageFunc = usePreparationImageFunction();
const { images, total, nextImages } = useImages(preparationImageFunc);

async function getMoreImages() {
  await nextImages(props.preparation);
}

await getMoreImages();
</script>

<template>
  <div style="margin: initial">
    <div v-if="images.length > 0">
      <div>
        <ImageBar
          :images="images"
          :total="total"
          @update="getMoreImages"
        >
          <template #tooltipInfo="{ item }">
            <div v-if="item.info.author">
              <span class="font-weight-bold">{{ $t("photo.author") }}: </span>
              <span>{{ item.info.author }}</span>
            </div>
            <div v-if="item.info.date || item.info.dateText">
              <span class="font-weight-bold">{{ $t("photo.date") }}: </span>
              <span v-if="item.info.date">
                {{ $formatDate(item.info.date) }}
              </span>
              <span v-else>{{ item.info.dateText }}</span>
            </div>
          </template>
          <template #overlayInfo="{ item }">
            <div v-if="item.info.author">
              <span class="font-weight-bold">{{ $t("photo.author") }}: </span>
              <span>{{ item.info.author }}</span>
            </div>
            <div v-if="item.info.date || item.info.dateText">
              <span class="font-weight-bold">{{ $t("photo.date") }}: </span>
              <span v-if="item.info.date">
                {{ $formatDate(item.info.date) }}
              </span>
              <span v-else>{{ item.info.dateText }}</span>
            </div>
          </template>
        </ImageBar>
      </div>
    </div>
    <div>
      <div
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
          <TableRow
            v-if="analysis"
            :title="$t('preparation.analysis')"
            :value="analysis"
          >
            <template #value="{ value }">
              <BaseLink
                :to="
                  localePath({
                    name: 'analysis-id',
                    params: { id: value.id },
                  })
                "
              >
                {{ value.id }}
              </BaseLink>
            </template>
          </TableRow>
          <TableRow
            v-if="taxon"
            :title="$t('preparation.taxon')"
            :value="taxon"
          >
            <template #value="{ value }">
              <BaseLinkExternal
                :to="`https://fossiilid.info/${taxon.id}`
                "
              >
                {{ value.name }}
              </BaseLinkExternal>
            </template>
          </TableRow>
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
      </div>
      <div :xl="4">
        <BaseTable class="border rounded">
          <TableRow
            v-if="sample"
            :title="$t('sample.number')"
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
                  sample.number
                    || sample.number_additional
                    || sample.number_field
                    || sample.id
                }}
              </BaseLink>
            </template>
          </TableRow>
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
      </div>
    </div>
  </div>
</template>
