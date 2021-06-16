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
          @input="handleInput($event, true)"
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
          @input="handleInput($event, false)"
        ></v-text-field>
      </template>
    </v-range-slider>
  </div>
</template>

<script>
import rangeFieldMixin from '@/mixins/rangeFieldMixin'
export default {
  name: 'RangeSliderField',
  mixins: [rangeFieldMixin],
  props: {
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
  },
}
</script>
