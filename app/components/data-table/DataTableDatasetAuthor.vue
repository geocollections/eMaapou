<template>
  <!-- @vue-ignore -->
  <BaseDataTable v-bind="$attrs">
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
