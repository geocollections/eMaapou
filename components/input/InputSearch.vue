<script setup lang="ts">
const props = defineProps({
  showButton: {
    type: Boolean,
    default: false,
  },
  iconButton: {
    type: Boolean,
    default: false,
  },
  dense: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default(): string {
      const { t } = useI18n();
      return t("common.searchAlt").toString();
    },
  },
  autofocus: {
    type: Boolean,
    default: false,
  },
  inputClass: {
    type: String,
    default: "",
  },
  maxWidth: {
    type: Number,
    default: -1,
  },
});

const searchFocused = ref(false);
const searchInput = ref();
const inputStyle = computed(() => ({
  maxWidth: props.maxWidth > 0 ? `${props.maxWidth}px` : "inherit",
  width: "100%",
}));
</script>

<template>
  <div style="display: contents">
    <v-text-field
      ref="searchInput"
      :model-value="modelValue"
      color="accent"
      :placeholder="placeholder"
      single-line
      hide-details
      variant="solo"
      :rounded="0"
      flat
      density="comfortable"
      class="border-t border-b"
      clearable
      :style="inputStyle"
      :class="inputClass"
      :autofocus="autofocus"
      v-bind="{ ...$props, ...$attrs }"
      @update:model-value="$emit('input', $event)"
      @keyup.enter="$emit('enter', $event)"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
    />
    <search-hints v-model="searchFocused" :activator="searchInput" />
  </div>
</template>

<style scoped lang="scss">
$border-color: var(--v-accent-darken2);
$border-color-hover: var(--v-accent-darken2);
$border-width: 0px;
$transition: border 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);

.global-search {
  ::v-deep .v-input__slot {
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
