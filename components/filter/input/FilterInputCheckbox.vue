<template>
  <div style="flex: 1 0 100%; max-width: 100%; position: relative">
    <v-checkbox
      class="ml-2"
      hide-details
      color="accent"
      :input-value="value"
      dense
      false-value="null"
      :disabled="disabled"
      @change="$emit('input', $event)"
    >
      <template #label>
        <div
          class="font-weight-medium text-body-1"
          style="
            color: rgba(0, 0, 0, 0.87) !important;
            font-size: 0.9375rem !important;
          "
        >
          {{ label }}
        </div>
      </template>
    </v-checkbox>
  </div>
</template>

<script>
export default {
  name: 'FilterInputCheckbox',
  props: {
    value: { type: Boolean, default: false },
    label: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
  },
}
</script>
