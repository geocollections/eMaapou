<template>
  <base-data-table v-bind="$attrs">
    <template #item.name="{ item, index }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'area-id', params: { id: item.id } })"
        @click="emit('click:row', index)"
      >
        {{ $translate({ et: item.name, en: item.name_en }) }}
      </nuxt-link>
    </template>
    <template #item.county="{ item }">
      <span>{{ $translate({ et: item.maakond, en: item.maakond_en }) }}</span>
    </template>
    <template #item.type="{ item }">
      <span>
        {{ $translate({ et: item.area_type, en: item.area_type_en }) }}
      </span>
    </template>
  </base-data-table>
</template>

<script setup lang="ts">
const emit = defineEmits(["click:row"]);
const localePath = useLocalePath();
</script>
