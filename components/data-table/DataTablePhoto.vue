<script setup lang="ts">
const emit = defineEmits<{
  "click:row": [payload: { index: number; id: string }];
}>();
const localePath = useLocalePath();
</script>

<template>
  <!-- @vue-ignore -->
  <BaseDataTable
    v-bind="$attrs"
    :item-to="(item) => localePath({ name: 'file-id', params: { id: item.id } })"
    @click:row="emit('click:row', $event)"
  >
    <template #item.id="{ item }">
      {{ item.id }}
    </template>
    <template #item.image_number="{ item }">
      {{ item.image_number }}
    </template>
    <template #item.locality="{ item }">
      <NuxtLink
        class="text-link"
        :to="localePath({ name: 'locality-id', params: { id: item.id } })"
      >
        {{ $translate({ et: item.locality, en: item.locality_en }) }}
      </NuxtLink>
    </template>

    <template #item.date="{ item }">
      <div v-if="item.date_created">
        {{ $formatDate(item.date_created) }}
      </div>
      <div v-else>
        {{ item.date_created_free }}
      </div>
    </template>
  </BaseDataTable>
</template>
