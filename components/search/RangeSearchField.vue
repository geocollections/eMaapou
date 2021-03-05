<template>
  <!-- <div>
    <v-row>
      <v-col>
        <div>{{ label }}</div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-text-field
          :value="value.min"
          class="searchField"
          color="grey darken-3"
          :label="fieldLabels.min"
          hide-details
          type="number"
          @input="handleInput({ isMin: true, value: $event })"
        >
        </v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field
          :value="value.max"
          class="searchField"
          color="grey darken-3"
          :label="fieldLabels.max"
          hide-details
          single-line
          type="number"
          @input="handleInput({ isMin: false, value: $event })"
        />
      </v-col>
    </v-row>
  </div> -->
  <div>
    <v-subheader v-if="label">{{ label }}</v-subheader>
    <v-range-slider
      :value="value"
      :min="min"
      :max="max"
      @input="$emit('input', $event)"
    >
      <template #prepend>
        <v-text-field
          :value="value[0]"
          class="mt-0 pt-0"
          hide-details
          single-line
          type="number"
          style="width: 50px"
          @change="$set(value, 0, $event)"
        ></v-text-field>
      </template>
      <template #append>
        <v-text-field
          :value="value[1]"
          class="mt-0 pt-0"
          hide-details
          single-line
          type="number"
          style="width: 50px"
          @change="$set(value, 1, $event)"
        ></v-text-field> </template
    ></v-range-slider>
  </div>
</template>

<script>
export default {
  name: 'RangeSearchField',
  props: {
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
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
  created() {
    this.$emit('input', [this.min, this.max])
  },
  methods: {
    handleInput(e) {
      if (e.isMin === true) {
        this.$emit('input', { ...this.value, min: e.value })
      } else {
        this.$emit('input', { ...this.value, max: e.value })
      }
    },
  },
}
</script>
