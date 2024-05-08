<script setup lang="ts">
const emit = defineEmits(["click:row"]);
const localePath = useLocalePath();
</script>

<template>
  <!-- @vue-ignore -->
  <BaseDataTable
    v-bind="$attrs"
    :item-to="(item) => localePath({ name: 'area-id', params: { id: item.id } })"
    @click:row="emit('click:row', $event)"
  >
    <template #item.name="{ item }">
      {{ $translate({ et: item.name, en: item.name_en }) }}
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
