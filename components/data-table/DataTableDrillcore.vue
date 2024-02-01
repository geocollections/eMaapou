<template>
  <base-data-table v-bind="$attrs">
    <template #item.drillcore="{ item, index }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'drillcore-id', params: { id: item.id } })"
        @click="emit('click:row', index)"
      >
        {{ $translate({ et: item.drillcore, en: item.drillcore_en }) }}
      </nuxt-link>
    </template>
  </base-data-table>
</template>

<script setup lang="ts">
const emit = defineEmits(["click:row"]);
const localePath = useLocalePath();
</script>
