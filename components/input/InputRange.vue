<script>
import isEmpty from "lodash/isEmpty";

export default {
  name: "InputRange",
  props: {
    value: {
      type: Array,
      default: () => {
        return [null, null];
      },
    },
    label: {
      type: String,
      default: null,
    },
    fieldLabels: {
      type: Object,
      default: () => {
        return { min: "min", max: "max" };
      },
    },
  },
  data() {
    return {
      isFocused: false,
    };
  },
  methods: {
    handleFocus() {
      this.isFocused = true;
    },
    handleBlur() {
      this.isFocused = false;
    },
    parseInput(input) {
      if (isEmpty(input))
        return null;
      else return Number.parseInt(input);
    },
    handleInput(e, isMin) {
      if (isMin)
        this.$emit("input", [this.parseInput(e), this.value[1]]);
      else
        this.$emit("input", [this.value[0], this.parseInput(e)]);
    },
  },
};
</script>

<template>
  <div class="pt-1">
    <VSubheader
      v-if="label"
      class="px-0 d-inline"
      :class="{ 'primary--text text--darken-3': isFocused }"
    >
      {{ label }}
    </VSubheader>
    <VRow>
      <VCol cols="6">
        <VTextField
          :model-value="value[0]"
          color="primary-darken-3"
          :label="fieldLabels.min"
          hide-details
          single-line
          type="number"
          @update:model-value="handleInput($event, true)"
          @focus="handleFocus"
          @blur="handleBlur"
        />
      </VCol>
      <VCol cols="6">
        <VTextField
          :model-value="value[1]"
          color="primary-darken-3"
          :label="fieldLabels.max"
          hide-details
          single-line
          type="number"
          @update:model-value="handleInput($event, false)"
          @focus="handleFocus"
          @blur="handleBlur"
        />
      </VCol>
    </VRow>
  </div>
</template>

<style lang="scss" scoped>
.v-text-field {
  padding-top: 0px;
  margin-top: 0px;
}
</style>
