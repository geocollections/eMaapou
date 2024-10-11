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
        {{ item.taxon.taxon }}
      </BaseLinkExternal>
    </template>

    <template #item.agent="{ item }">
      <div v-if="item.agent_identified">
        {{ item.agent_identified.agent }}
      </div>
    </template>

    <template #item.extra="{ item }">
      <div v-if="item.extra">
        {{ mdiPlus }}
      </div>
      <div v-else>
        {{ mdiMinus }}
      </div>
    </template>
  </BaseDataTable>
</template>
