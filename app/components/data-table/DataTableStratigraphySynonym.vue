<script setup lang="ts">
const tableAttrs = useBaseDataTableAttrs();
</script>

<template>
  <BaseDataTable v-bind="tableAttrs">
    <template #item.language="{ item }">
      <div v-if="item.language">
        {{
          $translate({ et: item.language.value, en: item.language.value_en })
        }}
      </div>
    </template>
    <template #item.reference="{ item }">
      <BaseLinkExternal
        v-if="item.reference"
        @click="$openGeokirjandus('reference', item.reference.id)"
      >
        {{ item.reference.reference }}
      </BaseLinkExternal>
    </template>
  </BaseDataTable>
</template>
