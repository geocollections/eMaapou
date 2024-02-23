<template>
  <base-data-table v-bind="$attrs">
    <template #item.reference="{ item }">
      <a
        v-if="item.reference"
        class="text-link"
        @click="$openGeology('reference', item.reference.id)"
      >{{ item.reference.id }}</a>
    </template>

    <template #item.reference__title="{ item }">
      <a
        v-if="item.reference"
        class="text-link"
        @click="$openGeology('reference', item.reference.id)"
      >{{ item.reference.reference }}</a>
    </template>
  </base-data-table>
</template>
