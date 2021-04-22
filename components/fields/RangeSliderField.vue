<template>
  <div class="pt-1">
    <v-subheader v-if="label" class="px-0 d-inline">{{ label }}</v-subheader>
    <v-range-slider
      :value="value"
      :min="min"
      :max="max"
      hide-details=""
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
        ></v-text-field>
      </template>
    </v-range-slider>
  </div>
</template>

<script>
export default {
  name: 'RangeSliderField',
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
}
</script>
