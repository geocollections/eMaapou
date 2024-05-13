<script setup lang="ts">
const emit = defineEmits(["click:row"]);
const localePath = useLocalePath();
</script>

<template>
  <!-- @vue-ignore -->
  <BaseDataTable
    v-bind="$attrs"
    :item-to="(item) => localePath({ name: 'drillcore-id', params: { id: item.id } })"
    @click:row="emit('click:row', $event)"
  >
    <template #item.drillcore="{ item }">
      {{ $translate({ et: item.drillcore, en: item.drillcore_en }) }}
    </template>
  </BaseDataTable>
</template>
