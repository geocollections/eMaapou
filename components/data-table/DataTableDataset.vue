<script setup lang="ts">
const emit = defineEmits(["click:row"]);
const localePath = useLocalePath();
</script>

<template>
  <base-data-table v-bind="$attrs">
    <template #item.id="{ item, index }">
      <nuxt-link
        v-if="item.id"
        class="text-link"
        :to="localePath({ name: 'dataset-id', params: { id: item.id } })"
        @click="emit('click:row', { index, id: item.id })"
      >
        {{ item.id }}
      </nuxt-link>
    </template>

    <template #item.name="{ item, index }">
      <nuxt-link
        v-if="item.title"
        class="text-link"
        :to="localePath({ name: 'dataset-id', params: { id: item.id } })"
        @click="emit('click:row', { index, id: item.id })"
      >
        {{ item.title }}
      </nuxt-link>
    </template>

    <template #item.date="{ item }">
      <div v-if="item.date">
        {{ $formatDate(item.date) }}
      </div>
      <div v-else>
        {{ item.date_txt }}
      </div>
    </template>

    <template #item.database_acronym="{ item }">
      <nuxt-link
        class="text-link"
        :to="
          localePath({
            name: `institution-${item.database_acronym.toLowerCase()}`,
          })
        "
      >
        {{ item.database_acronym }}
      </nuxt-link>
    </template>
  </base-data-table>
</template>
