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
          @change="$set(value, 0, $event)"
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
          @change="$set(value, 1, $event)"
          @focus="handleFocus"
          @blur="handleBlur"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
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
  created() {
    this.$emit('input', [this.min, this.max])
  },
  methods: {
    handleFocus(e) {
      this.isFocused = true
    },
    handleBlur(e) {
      this.isFocused = false
    },
    handleChange(e) {
      this.$set(this.value, 0, e)
      if (this.value[1] == null) {
        this.$set(this.value, 1, e)
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
