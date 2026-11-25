<script setup lang="ts">
const tableAttrs = useBaseDataTableAttrs();
</script>

<template>
  <BaseDataTable v-bind="tableAttrs">
    <template #item.name="{ item }">
      {{ item.agent.name }}
    </template>
    <template #item.affiliation="{ item }">
      {{ item.affiliation }}
    </template>
    <template #item.type="{ item }">
      <div v-if="item.type">
        {{ item.type.value }}
      </div>
    </template>
  </BaseDataTable>
</template>
