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
    <template #item.title="{ item }">
      <div v-if="item.reference">
        {{ item.reference.title }}
      </div>
    </template>
  </BaseDataTable>
</template>
