<template>
  <!-- @vue-ignore -->
  <BaseDataTable v-bind="$attrs">
    <template #item.name="{ item }">
      {{ item.agent.agent }}
    </template>
    <template #item.affiliation="{ item }">
      {{ item.affiliation }}
    </template>
    <template #item.type="{ item }">
      <div v-if="item.agent_type">
        {{ item.agent_type.value }}
      </div>
    </template>
  </BaseDataTable>
</template>
