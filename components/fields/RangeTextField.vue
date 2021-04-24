<template>
  <div class="pt-1">
    <v-subheader
      v-if="label"
      class="px-0 d-inline"
      :class="{ 'primary--text text--darken-3': isFocused }"
      >{{ label }}</v-subheader
    >
    <v-row>
      <v-col cols="6">
        <v-text-field
          :value="value[0]"
          color="primary darken-3"
          :label="fieldLabels.min"
          hide-details
          single-line
          type="number"
          @input="handleInput($event, true)"
          @focus="handleFocus"
          @blur="handleBlur"
        >
        </v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field
          :value="value[1]"
          color="primary darken-3"
          :label="fieldLabels.max"
          hide-details
          single-line
          type="number"
          @input="handleInput($event, false)"
          @focus="handleFocus"
          @blur="handleBlur"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { isEmpty } from 'lodash'

export default {
  name: 'RangeTextField',
  props: {
    value: {
      type: Array,
      default: () => {
        return [null, null]
      },
    },
    label: {
      type: String,
      default: null,
    },
    fieldLabels: {
      type: Object,
      default: () => {
        return { min: 'min', max: 'max' }
      },
    },
  },
  data() {
    return {
      isFocused: false,
    }
  },
  methods: {
    handleFocus(e) {
      this.isFocused = true
    },
    handleBlur(e) {
      this.isFocused = false
    },
    parseInput(input) {
      if (isEmpty(input)) return null
      else return parseInt(input)
    },
    handleInput(e, isMin) {
      if (isMin) {
        this.$emit('input', [this.parseInput(e), this.value[1]])
      } else {
        this.$emit('input', [this.value[0], this.parseInput(e)])
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.v-text-field {
  padding-top: 0px;
  margin-top: 0px;
}
</style>
