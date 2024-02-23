<script setup lang="ts">
import isEmpty from "lodash/isEmpty";

const props = defineProps({
  title: { type: String, default: null },
  value: {
    type: [String, Number] as PropType<string | number>,
    default: null,
    required: false,
  },
});

const slots = useSlots();
const isInvalid = computed(() => {
  if (typeof props.value === "number")
    return false;
  return isEmpty(props.value);
});
const hasValueInSlot = computed(() => {
  return slots.value;
});
</script>

<template>
  <tr v-if="!isInvalid || hasValueInSlot">
    <td class="font-weight-medium">
      {{ title }}
    </td>
    <td>
      <slot name="value">
        {{ value }}
      </slot>
    </td>
  </tr>
</template>
