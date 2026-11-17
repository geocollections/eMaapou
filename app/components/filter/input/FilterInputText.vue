<script setup lang="ts">
const props = defineProps<{ title: string; modelValue: string[] }>();
const emit = defineEmits<{ "update:modelValue": [value: string[]] }>();
const { t } = useI18n();
const open = ref(false);
const internalValue = ref("");
const input = ref();
useFilterFocus(open, input);
function handleAdd() {
  const value = internalValue.value.trim();
  if (!value || props.modelValue.includes(value))
    return;
  emit("update:modelValue", [...props.modelValue, value]);
  internalValue.value = "";
}
function handleRemove(index: number) {
  emit("update:modelValue", props.modelValue.filter((_, position) => position !== index));
}
function handleChange(index: number) {
  internalValue.value = props.modelValue[index] ?? "";
  handleRemove(index);
  open.value = true;
}
</script>

<template>
  <PortalFilterSection
    v-model:open="open"
    :title="title"
    :selected-count="modelValue.length"
    data-test="panel"
  >
    <template #selection>
      <div
        v-for="(item, index) in modelValue"
        :key="item"
        data-test="selected-item"
        class="portal-selected-text"
        @click="handleChange(index)"
      >
        <UCheckbox
          :model-value="true"
          :aria-label="item"
          @click.stop
          @update:model-value="handleRemove(index)"
        /><span>{{ item }}</span>
      </div>
    </template>
    <UInput
      ref="input"
      v-model="internalValue"
      data-test="text-input"
      :aria-label="title"
      :placeholder="t('filters.filter')"
      class="portal-full-field"
      @keydown.enter.prevent.stop="handleAdd"
    />
    <UButton
      data-test="add-button"
      class="portal-filter-add"
      :disabled="!internalValue.trim()"
      @click="handleAdd"
    >
      {{ t('common.add') }}
    </UButton>
  </PortalFilterSection>
</template>
