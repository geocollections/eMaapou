<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: any | null;
  items?: any[];
  useCustomMarkers?: boolean;
}>(), { items: () => [] as any[], useCustomMarkers: false });

const emit = defineEmits<{
  "update:model-value": [value: any | null];
}>();

const show = ref(false);

function handleOpen() {
  show.value = !show.value;
}
function handleRemove() {
  emit("update:model-value", null);
}
const valueString = computed(() => {
  return `${props.modelValue?.geometry.type} ${props.modelValue?.geometry.coordinates}`;
});
</script>

<template>
  <div
    bg-color="transparent"
    elevation="0"
    :rounded="0"
    style="background-color: transparent"
    @group:selected="handleOpen"
  >
    <div
      class="py-1 pl-4 pr-1 font-weight-medium"
      style="min-height: 40px"
    >
      {{ $t("filters.map") }}
    </div>
    <div
      v-if="modelValue !== null"
      class="bg-white"
    >
      <div class="d-flex selected-item py-1 px-2">
        <span>
          <input
            type="checkbox"
            class="checkbox"
            checked
            @click.prevent.stop="handleRemove"
          >
        </span>
        <span
          class="align-self-center pl-2 text-body-2 font-weight-medium text-truncate"
        >
          {{ valueString }}
        </span>
      </div>
    </div>
    <div>
      <div class="pa-0">
        <MapSearch
          :model-value="modelValue"
          @update:model-value="$emit('update:model-value', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.v-expansion-panel-text__wrapper) {
  padding: 0px;
}

.checkbox {
  accent-color: var(--v-accent-base);
}
</style>
