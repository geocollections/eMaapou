<template>
  <BaseDataTable v-bind="$attrs">
    <template #item.reference="{ item }">
      <BaseLinkExternal
        v-if="item.reference"
        @click.native="$openGeology('reference', item.reference.id)"
      >
        {{ item.reference.reference }}
      </BaseLinkExternal>
    </template>
  </BaseDataTable>
</template>
