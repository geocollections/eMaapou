<script setup lang="ts">
const localePath = useLocalePath();

const tableAttrs = useBaseDataTableAttrs();
</script>

<template>
  <BaseDataTable
    v-bind="tableAttrs"
    :item-to="(item) => localePath({ name: 'drillcore-id', params: { id: item.id } })"
  >
    <template #item.drillcore="{ item }">
      {{ $translate({ et: item.drillcore, en: item.drillcore_en }) }}
    </template>
  </BaseDataTable>
</template>
