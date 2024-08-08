<template>
  <!-- @vue-ignore -->
  <BaseDataTable v-bind="$attrs">
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
