<script setup lang="ts">
import { mdiCheckBold, mdiCloseThick } from "@mdi/js";

const localePath = useLocalePath();
</script>

<template>
  <BaseDataTable v-bind="$attrs">
    <template #item.name="{ item }">
      <NuxtLink
        v-if="item.locality"
        class="text-link"
        :to="
          localePath({ name: 'locality-id', params: { id: item.locality.id } })
        "
      >
        {{
          $translate({
            et: item.locality.locality,
            en: item.locality.locality_en,
          })
        }}
      </NuxtLink>
    </template>
    <template #item.longitude="{ item }">
      {{ item.point_longitude }}
    </template>
    <template #item.latitude="{ item }">
      {{ item.point_latitude }}
    </template>
    <template #item.is_polygon="{ item }">
      <VIcon
        v-if="item.polygon"
        color="green"
        size="small"
      >
        {{ mdiCheckBold }}
      </VIcon>
      <VIcon
        v-else
        color="red"
        size="small"
      >
        {{ mdiCloseThick }}
      </VIcon>
    </template>
  </BaseDataTable>
</template>
