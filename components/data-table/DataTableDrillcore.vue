<script setup lang="ts">
const emit = defineEmits(["click:row"]);
const localePath = useLocalePath();
</script>

<template>
  <BaseDataTable v-bind="$attrs">
    <template #item.drillcore="{ item, index }">
      <NuxtLink
        class="text-link"
        :to="localePath({ name: 'drillcore-id', params: { id: item.id } })"
        @click="emit('click:row', { index, id: item.id })"
      >
        {{ $translate({ et: item.drillcore, en: item.drillcore_en }) }}
      </NuxtLink>
    </template>
  </BaseDataTable>
</template>
