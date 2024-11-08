<script setup lang="ts">
import { mdiMinus, mdiPlus } from "@mdi/js";
</script>

<template>
  <!-- @vue-ignore -->
  <BaseDataTable v-bind="$attrs">
    <template #item.taxon="{ item }">
      <BaseLinkExternal
        v-if="item.taxon"
        @click="$openWindow(`https://fossiilid.info/${item.taxon.id}`)"
      >
        {{ item.taxon.name }}
      </BaseLinkExternal>
    </template>

    <template #item.agent="{ item }">
      <div v-if="item.agent_identified">
        {{ item.agent_identified.agent }}
      </div>
    </template>

    <template #item.extra="{ item }">
      <BaseBoolean :model-value="item.extra" />
    </template>
  </BaseDataTable>
</template>
