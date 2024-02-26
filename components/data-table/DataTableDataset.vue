<script setup lang="ts">
const emit = defineEmits(["click:row"]);
const localePath = useLocalePath();
</script>

<template>
  <BaseDataTable v-bind="$attrs">
    <template #item.id="{ item, index }">
      <NuxtLink
        v-if="item.id"
        class="text-link"
        :to="localePath({ name: 'dataset-id', params: { id: item.id } })"
        @click="emit('click:row', { index, id: item.id })"
      >
        {{ item.id }}
      </NuxtLink>
    </template>

    <template #item.name="{ item, index }">
      <NuxtLink
        v-if="item.title"
        class="text-link"
        :to="localePath({ name: 'dataset-id', params: { id: item.id } })"
        @click="emit('click:row', { index, id: item.id })"
      >
        {{ item.title }}
      </NuxtLink>
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
      <NuxtLink
        class="text-link"
        :to="
          localePath({
            name: `institution-${item.database_acronym.toLowerCase()}`,
          })
        "
      >
        {{ item.database_acronym }}
      </NuxtLink>
    </template>
  </BaseDataTable>
</template>
