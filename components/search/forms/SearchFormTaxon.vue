<script setup lang="ts">
const emit = defineEmits(["update", "reset"]);

const taxaStore = useTaxa();
const { filters, query } = storeToRefs(taxaStore);

function handleReset() {
  emit("reset");
}

function handleUpdate() {
  nextTick(() => {
    emit("update");
  });
}
</script>

<template>
  <VForm @submit.prevent="handleUpdate">
    <InputSearch v-model="query" />
    <SearchActions class="mb-3" @click="handleReset" />
    <VExpansionPanels variant="accordion" multiple>
      <FilterInputText
        v-model="filters.species.value"
        :title="$t('filters.species')"
        value="species"
        @update:model-value="handleUpdate"
      />
      <!-- TODO: add taxon hieararchy filter -->
      <FilterMap
        v-model="filters.geometry.value"
        value="map"
        @update:model-value="handleUpdate"
      />
      <FilterInputText
        v-model="filters.author.value"
        :title="$t('filters.author')"
        value="author"
        @update:model-value="handleUpdate"
      />
    </VExpansionPanels>
  </VForm>
</template>
