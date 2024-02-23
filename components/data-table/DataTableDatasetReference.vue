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
    <template #item.title="{ item }">
      <div v-if="item.reference">
        {{ item.reference.title }}
      </div>
    </template>

    <template #item.journal="{ item }">
      <div v-if="item.reference && item.reference.journal">
        {{ item.reference.journal.journal_name }}
      </div>
      <div v-else-if="item.reference.book">
        {{ item.reference.book }}
      </div>
    </template>
    <template #item.pages="{ item }">
      <div v-if="item.reference">
        {{ item.reference.pages }}
      </div>
    </template>
  </base-data-table>
</template>
