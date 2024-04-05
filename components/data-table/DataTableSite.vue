<script setup lang="ts">
import isNil from "lodash/isNil";

const emit = defineEmits(["click:row"]);
const localePath = useLocalePath();
</script>

<template>
  <BaseDataTable v-bind="$attrs">
    <template #item.id="{ item, index }">
      <NuxtLink
        class="text-link"
        :to="localePath({ name: 'site-id', params: { id: item.id } })"
        @click="emit('click:row', { index, id: item.id })"
      >
        {{ item.id }}
      </NuxtLink>
    </template>
    <template #item.name="{ item, index }">
      <NuxtLink
        class="text-link"
        :to="localePath({ name: 'site-id', params: { id: item.id } })"
        @click="emit('click:row', { index, id: item.id })"
      >
        {{ item.name }}
      </NuxtLink>
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
