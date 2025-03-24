<template>
  <!-- @vue-ignore -->
  <BaseDataTable v-bind="$attrs">
    <template #item.reference="{ item }">
      <BaseLinkExternal
        v-if="item.reference"
        class="text-link"
        @click="$openGeokirjandus('reference', item.reference.id)"
      >
        {{ item.reference.reference }}
      </BaseLinkExternal>
    </template>

    <template #item.reference__title="{ item }">
      {{ item.reference.title }}
    </template>
  </BaseDataTable>
</template>
