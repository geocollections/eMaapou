<script setup lang="ts">
const props = defineProps<{ modelValue: [string | undefined, string | undefined]; title: string }>();
const emit = defineEmits<{ "update:modelValue": [value: [string | undefined, string | undefined]] }>();
const { t } = useI18n();
const open = ref(false);
const input = ref();
const draft = ref<[string | undefined, string | undefined]>([...props.modelValue]);
const today = new Date().toISOString().slice(0, 10);
watch(() => props.modelValue, value => draft.value = [...value]);
useFilterFocus(open, input);
function apply() {
  emit("update:modelValue", [...draft.value]);
}
function clear() {
  draft.value = [undefined, undefined];
  apply();
}
const label = computed(() => `${props.modelValue[0] ?? "*"} – ${props.modelValue[1] ?? "*"}`);
</script>

<template>
  <PortalFilterSection v-model:open="open" :title="title">
    <template #selection>
      <PortalFilterChoice
        v-if="modelValue.some(Boolean)"
        :label="label"
        :selected="true"
        @select="clear"
      />
    </template>
    <div class="portal-filter-pair">
      <UFormField :label="t('common.from')">
        <UInput
          ref="input"
          v-model="draft[0]"
          type="date"
          :max="draft[1] || today"
          class="portal-full-field"
          @change="apply"
        />
      </UFormField><UFormField :label="t('common.to')">
        <UInput
          v-model="draft[1]"
          type="date"
          :min="draft[0]"
          :max="today"
          class="portal-full-field"
          @change="apply"
        />
      </UFormField>
    </div>
  </PortalFilterSection>
</template>
