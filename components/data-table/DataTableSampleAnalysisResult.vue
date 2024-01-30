<template>
  <base-data-table v-bind="$attrs">
    <template #item.analysis_method="{ item }">{{
      $translate({ et: item.analysis_method, en: item.analysis_method_en })
    }}</template>
  </base-data-table>
</template>
