<template>
  <BaseDataTable v-bind="$attrs">
    <template #item.reference="{ item }">
      <a
        v-if="item.reference"
        class="text-link"
        @click="$openGeology('reference', item.reference.id)"
      >{{ item.reference.reference }}</a>
    </template>

    <template #item.reference__title="{ item }">
      {{ item.reference.title }}
    </template>
  </BaseDataTable>
</template>
