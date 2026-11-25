<script setup lang="ts">
const tableAttrs = useBaseDataTableAttrs();
</script>

<template>
  <BaseDataTable v-bind="tableAttrs">
    <template #item.identifier="{ item }">
      <BaseLinkExternal
        v-if="item.identifier"
        @click="
          $openWindow(`http://doi.geocollections.info/${item.identifier}`)
        "
      >
        {{ item.identifier }}
      </BaseLinkExternal>
    </template>

    <template #item.datacite_created="{ item }">
      <div v-if="item.datacite_created">
        <div>
          {{ $formatDate(item.datacite_created) }}
        </div>
        <div
          v-if="
            item.datacite_updated
              && item.datacite_created !== item.datacite_updated
          "
        >
          ({{ $formatDate(item.datacite_updated) }})
        </div>
      </div>
    </template>
  </BaseDataTable>
</template>
