<script setup lang="ts">
import { mdiCheckBold, mdiCloseThick } from "@mdi/js";

const localePath = useLocalePath();
</script>

<template>
  <base-data-table v-bind="$attrs">
    <template #item.name="{ item }">
      <nuxt-link
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
      </nuxt-link>
    </template>
    <template #item.longitude="{ item }">
      {{ item.point_longitude }}
    </template>
    <template #item.latitude="{ item }">
      {{ item.point_latitude }}
    </template>
    <template #item.is_polygon="{ item }">
      <v-icon
        v-if="item.polygon"
        color="green"
        size="small"
      >
        {{ mdiCheckBold }}
      </v-icon>
      <v-icon
        v-else
        color="red"
        size="small"
      >
        {{ mdiCloseThick }}
      </v-icon>
    </template>
  </base-data-table>
</template>
