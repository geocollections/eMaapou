<script setup lang="ts">
import isNil from "lodash/isNil";

const localePath = useLocalePath();
</script>

<template>
  <!-- @vue-ignore -->
  <BaseDataTable
    v-bind="$attrs"
    :item-to="(item) => localePath({ name: 'locality-id', params: { id: item.id } })"
  >
    <template #item.id="{ item }">
      {{ item.id }}
    </template>
    <template #item.locality="{ item }">
      {{ $translate({ et: item.locality, en: item.locality_en }) }}
    </template>

    <template #item.coordinates="{ item }">
      <span v-if="!isNil(item.latitude) && !isNil(item.longitude)">
        {{ getCoordinatesStr(item.latitude, item.longitude) }}
      </span>
    </template>
    <template #item.latitude="{ item }">
      <span v-if="item.latitude">
        {{ item.latitude.toFixed(6) }}
      </span>
    </template>
    <template #item.longitude="{ item }">
      <span v-if="item.longitude">
        {{ item.longitude.toFixed(6) }}
      </span>
    </template>
    <template #item.country="{ item }">
      {{ $translate({ et: item.country, en: item.country_en }) }}
    </template>
    <template #item.references="{ item }">
      {{ item.related_references }}
    </template>
    <template #item.specimens="{ item }">
      {{ item.related_specimens }}
    </template>
    <template #item.samples="{ item }">
      {{ item.related_samples }}
    </template>
    <template #item.analyses="{ item }">
      {{ item.related_analyses }}
    </template>
    <template #item.drillcores="{ item }">
      {{ item.related_drillcores }}
    </template>
    <template #item.files="{ item }">
      {{ item.related_files }}
    </template>
    <template #item.images="{ item }">
      {{ item.related_images }}
    </template>
    <template #item.stratotypes="{ item }">
      {{ item.related_stratotypes }}
    </template>
    <template #item.taxonOccurrences="{ item }">
      {{ item.related_taxon_occurrences }}
    </template>
  </BaseDataTable>
</template>
