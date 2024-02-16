<template>
  <base-data-table v-bind="$attrs">
    <template #item.reference="{ item }">
      <base-link-external
        v-if="item.reference"
        @click.native="$openGeology('reference', item.reference.id)"
      >
        {{ item.reference.reference }}
      </base-link-external>
    </template>
    <template #item.year="{ item }">
      <div v-if="item.reference">
        {{ item.reference.year }}
      </div>
    </template>
    <template #item.content="{ item }">
      {{ $translate({ et: item.content, en: item.content_en }) }}
    </template>
  </base-data-table>
</template>
