<script setup lang="ts">
const emit = defineEmits(["click:row"]);
const localePath = useLocalePath();
</script>

<template>
  <BaseDataTable v-bind="$attrs">
    <template #item.id="{ item, index }">
      <NuxtLink
        class="text-link"
        :to="localePath({ name: 'file-id', params: { id: item.id } })"
        @click="emit('click:row', index)"
      >
        {{ item.id }}
      </NuxtLink>
    </template>
    <template #item.image_number="{ item, index }">
      <NuxtLink
        class="text-link"
        :to="localePath({ name: 'file-id', params: { id: item.id } })"
        @click="emit('click:row', index)"
      >
        {{ item.image_number }}
      </NuxtLink>
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
