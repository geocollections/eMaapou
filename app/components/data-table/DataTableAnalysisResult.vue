<script setup lang="ts">
const { $translate } = useNuxtApp();

const tableAttrs = useBaseDataTableAttrs();
</script>

<template>
  <BaseDataTable v-bind="tableAttrs">
    <template #item.analysis_method="{ item }">
      {{
        $translate({ et: item.analysis_method, en: item.analysis_method_en })
      }}
    </template>
  </BaseDataTable>
</template>
