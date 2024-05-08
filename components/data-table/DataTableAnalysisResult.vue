<script setup lang="ts">
const { $translate } = useNuxtApp();
</script>

<template>
  <!-- @vue-ignore -->
  <BaseDataTable v-bind="$attrs">
    <template #item.analysis_method="{ item }">
      {{
        $translate({ et: item.analysis_method, en: item.analysis_method_en })
      }}
    </template>
  </BaseDataTable>
</template>
