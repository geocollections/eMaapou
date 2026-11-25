<script setup lang="ts">
const tableAttrs = useBaseDataTableAttrs();
</script>

<template>
  <BaseDataTable v-bind="tableAttrs">
    <template #item.reference="{ item }">
      <BaseLinkExternal
        v-if="item.reference"
        @click="$openGeokirjandus('reference', item.reference.id)"
      >
        {{ item.reference.reference }}
      </BaseLinkExternal>
    </template>
    <template #item.year="{ item }">
      <div v-if="item.reference">
        {{ item.reference.year }}
      </div>
    </template>
    <template #item.content="{ item }">
      {{ $translate({ et: item.content, en: item.content_en }) }}
    </template>
  </BaseDataTable>
</template>
