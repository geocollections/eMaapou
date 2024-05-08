<script setup lang="ts">
import isNil from "lodash/isNil";

const emit = defineEmits(["click:row"]);
const localePath = useLocalePath();
</script>

<template>
  <!-- @vue-ignore -->
  <BaseDataTable
    v-bind="$attrs"
    :item-to="(item) => localePath({ name: 'site-id', params: { id: item.id } })"
    @click:row="emit('click:row', $event)"
  >
    <template #item.id="{ item }">
      {{ item.id }}
    </template>
    <template #item.name="{ item }">
      {{ item.name }}
    </template>
    <template #item.area="{ item }">
      <NuxtLink
        class="text-link"
        :to="localePath({ name: 'area-id', params: { id: item.area_id } })"
      >
        {{
          $translate({
            et: item.area_name,
            en: item.area_name_en,
          })
        }}
      </NuxtLink>
    </template>
    <template #item.coordinates="{ item }">
      <span v-if="!isNil(item.latitude) && !isNil(item.longitude)">
        {{ getCoordinatesStr(item.latitude, item.longitude) }}
      </span>
    </template>
    <template #item.depth="{ item }">
      <span v-if="item.depth">
        {{ item.depth.toFixed(2) }}
      </span>
    </template>
    <template #item.elevation="{ item }">
      <span v-if="item.z">
        {{ item.z.toFixed(2) }}
      </span>
    </template>
  </BaseDataTable>
</template>
