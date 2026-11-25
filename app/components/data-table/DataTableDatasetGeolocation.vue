<script setup lang="ts">
import { mdiCheckBold, mdiCloseThick } from "@mdi/js";
import isNil from "lodash/isNil";

const localePath = useLocalePath();

const tableAttrs = useBaseDataTableAttrs();
</script>

<template>
  <BaseDataTable v-bind="tableAttrs">
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
            et: item.locality.name,
            en: item.locality.name_en,
          })
        }}
      </NuxtLink>
    </template>
    <template #item.coordinates="{ item }">
      <span v-if="!isNil(item.point_latitude) && !isNil(item.point_longitude)">
        {{ getCoordinatesStr(item.point_latitude, item.point_longitude) }}
      </span>
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
