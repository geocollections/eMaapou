<script setup lang="ts">
import type { Collection } from "../[id].vue";

const props = defineProps<{
  collection: Collection;
}>();

const reference = computed(() => props.collection.reference);
const database = computed(() => props.collection.database);
const classification = computed(() => props.collection.classification);
</script>

<template>
  <div style="margin: initial">
    <div>
      <div
        :sm="12"
        :md="6"
        :lg="7"
        :xl="5"
      >
        <BaseTable class="border rounded">
          <TableRow
            :title="$t('collection.number')"
            :value="collection.number"
          />
          <TableRow
            :title="$t('collection.name')"
            :value="
              $translate({
                et: collection.name,
                en: collection.name_en,
              })
            "
          />
          <TableRow
            :title="$t('collection.nameLong')"
            :value="
              $translate({
                et: collection.name_long,
                en: collection.name_long_en,
              })
            "
          />
          <TableRow
            v-if="classification"
            :title="$t('collection.classification')"
            :value="classification.name"
          />
          <TableRow
            v-if="reference"
            :title="$t('collection.reference')"
            :value="reference"
          >
            <template #value="{ value }">
              <BaseLinkExternal
                :to="`https://kirjandus.geoloogia.info/reference/${value.id}`"
              >
                {{
                  value.reference
                }}
              </BaseLinkExternal>
            </template>
          </TableRow>
          <TableRow
            v-if="collection.number_objects"
            :title="$t('collection.numberObjects')"
            :value="`${collection.number_objects}`"
          />
          <TableRow
            v-if="database"
            :title="$t('collection.database')"
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
            v-if="collection.date_added"
            :title="$t('collection.dateAdded')"
            :value="$formatDate(collection.date_added)"
          />
          <TableRow
            v-if="collection.date_changed"
            :title="$t('collection.dateChanged')"
            :value="$formatDate(collection.date_changed)"
          />
        </BaseTable>
        <div v-if="collection.remarks">
          <div class="text-h6 py-2">
            {{ $t("collection.remarks") }}
          </div>
          <div>{{ collection.remarks }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
