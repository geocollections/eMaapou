<template>
  <base-data-table v-bind="$attrs">
    <template #item.id="{ item, index }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'site-id', params: { id: item.id } })"
        @click="emit('click:row', index)"
      >
        {{ item.id }}
      </nuxt-link>
    </template>
    <template #item.name="{ item, index }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'site-id', params: { id: item.id } })"
        @click="emit('click:row', index)"
      >
        {{ item.name }}
      </nuxt-link>
    </template>
    <template #item.area="{ item }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'area-id', params: { id: item.area_id } })"
      >
        {{
          $translate({
            et: item.area_name,
            en: item.area_name_en,
          })
        }}
      </nuxt-link>
    </template>
  </base-data-table>
</template>

<script setup lang="ts">
const emit = defineEmits(["click:row"]);

const localePath = useLocalePath();
</script>
