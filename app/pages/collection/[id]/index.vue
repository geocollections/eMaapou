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
  <div class="portal-content-margin portal-content">
    <div class="portal-row">
      <div
        class="portal-record-primary"
      >
        <table class="portal-bordered-table">
          <tbody>
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
                  :to="externalUrl(`kirjandus.geoloogia.info/reference/${value.id}`)"
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
          </tbody>
        </table>
        <div v-if="collection.remarks">
          <div class="portal-section-title">
            {{ $t("collection.remarks") }}
          </div>
          <div>{{ collection.remarks }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
