<script setup lang="ts">
const emit = defineEmits(["click:row"]);
const localePath = useLocalePath();
</script>

<template>
  <base-data-table v-bind="$attrs">
    <template #item.id="{ item, index }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'file-id', params: { id: item.id } })"
        @click="emit('click:row', index)"
      >
        {{ item.id }}
      </nuxt-link>
    </template>
    <template #item.image_number="{ item, index }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'file-id', params: { id: item.id } })"
        @click="emit('click:row', index)"
      >
        {{ item.image_number }}
      </nuxt-link>
    </template>
    <template #item.locality="{ item }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'locality-id', params: { id: item.id } })"
      >
        {{ $translate({ et: item.locality, en: item.locality_en }) }}
      </nuxt-link>
    </template>

    <template #item.date="{ item }">
      <div v-if="item.date_created">
        {{ $formatDate(item.date_created) }}
      </div>
      <div v-else>
        {{ item.date_created_free }}
      </div>
    </template>
  </base-data-table>
</template>
