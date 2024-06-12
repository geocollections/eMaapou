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
    :item-to="(item) => localePath({ name: 'dataset-id', params: { id: item.id } })"
    @click:row="emit('click:row', $event)"
  >
    <template #item.id="{ item }">
      {{ item.id }}
    </template>

    <template #item.name="{ item }">
      {{ item.title }}
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
