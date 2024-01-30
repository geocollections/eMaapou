<template>
  <base-data-table v-bind="$attrs">
    <template #item.taxon="{ item }">
      <base-link-external
        v-if="item.taxon"
        @click.native="$openWindow(`https://fossiilid.info/${item.taxon.id}`)"
      >
        {{ item.taxon.taxon }}
      </base-link-external>
    </template>

    <template #item.agent="{ item }">
      <div v-if="item.agent_identified">
        {{ item.agent_identified.agent }}
      </div>
    </template>

    <template #item.extra="{ item }">
      <v-icon v-if="item.extra">{{ mdiPlus }}</v-icon>
      <v-icon v-else>{{ mdiMinus }}</v-icon>
    </template>
  </base-data-table>
</template>

<script setup lang="ts">
import { mdiPlus, mdiMinus } from "@mdi/js";
</script>
