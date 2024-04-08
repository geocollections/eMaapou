<script setup lang="ts">
const emit = defineEmits(["click:row"]);
const localePath = useLocalePath();
</script>

<template>
  <BaseDataTable v-bind="$attrs">
    <template #item.name="{ item, index }">
      <NuxtLink
        class="text-link"
        :to="localePath({ name: 'area-id', params: { id: item.id } })"
        @click="emit('click:row', { index, id: item.id })"
      >
        {{ $translate({ et: item.name, en: item.name_en }) }}
      </NuxtLink>
    </template>
    <template #item.county="{ item }">
      <span>{{ $translate({ et: item.maakond, en: item.maakond_en }) }}</span>
    </template>
    <template #item.type="{ item }">
      <span>
        {{ $translate({ et: item.area_type, en: item.area_type_en }) }}
      </span>
    </template>
    <template #item.size="{ item }">
      <span v-if="item.area_ha">{{ item.area_ha.toFixed(2) }}</span>
    </template>
    <template #item.miner="{ item }">
      <span v-if="item.kaevandaja">{{ item.kaevandaja }}</span>
    </template>
    <template #item.miningPermit="{ item }">
      <span v-if="item.loa_number">{{ item.loa_number }}</span>
    </template>
    <template #item.miningPermitOwner="{ item }">
      <span v-if="item.loa_omanik">{{ item.loa_omanik }}</span>
    </template>
  </BaseDataTable>
</template>
