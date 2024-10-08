<script setup lang="ts">
const props = withDefaults(defineProps<
  {
    modelValue: string;
    showButton?: boolean;
    iconButton?: boolean;
    dense?: boolean;
    placeholder?: string;
    autofocus?: boolean;
    inputClass?: string;
    maxWidth?: number;
    rounded?: number;
  }
>(), {
  showButton: false,
  iconButton: false,
  dense: false,
  placeholder: () => {
    const { t } = useI18n();
    return t("common.searchAlt");
  },
  autofocus: false,
  inputClass: "",
  maxWidth: -1,
  rounded: 0,
});
const emit = defineEmits<{
  "update:model-value": [value: string];
  "enter": [event: any];
  "focus": [event: any];
  "blur": [event: any];
}>();
const searchInput = ref();
const inputStyle = computed(() => ({
  maxWidth: props.maxWidth > 0 ? `${props.maxWidth}px` : "inherit",
  width: "100%",
}));
</script>

<template>
  <div style="display: contents">
    <VTextField
      ref="searchInput"
      :model-value="modelValue"
      color="accent"
      :placeholder="placeholder"
      single-line
      hide-details
      variant="outlined"
      bg-color="white"
      :rounded="rounded"
      flat
      clearable
      :style="inputStyle"
      :class="inputClass"
      :autofocus="autofocus"
      v-bind="{ ...$attrs }"
      @update:model-value="emit('update:model-value', $event)"
      @keyup.enter="emit('enter', $event)"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
    />
  </div>
</template>

<style scoped lang="scss">
$border-color: var(--v-accent-darken2);
$border-color-hover: var(--v-accent-darken2);
$border-width: 0px;
$transition: border 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);

.global-search {
  :deep(.v-input__slot) {
    padding-right: 0 !important;

    fieldset {
      border-color: $border-color !important;
      border-width: $border-width;

      transition: $transition;
    }

    .v-input__append-inner {
      margin-top: 0 !important;
      // height: 40px;
      height: 56px;
      .v-input__icon {
        align-self: center;
        padding-right: 12px;
      }

      button {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-left-width: 0px !important;
        height: 100%;
        border-width: $border-width;
        border-color: $border-color !important;
        border-style: solid;
        transition: $transition;
      }
    }

    &:hover {
      fieldset {
        border-color: $border-color-hover !important;
        transition: $transition;
      }

      .v-input__append-inner {
        button {
          border-color: $border-color-hover !important;
          transition: $transition;
        }
      }
    }
  }
}
</style>
