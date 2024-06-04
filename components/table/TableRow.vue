<script setup lang="ts">
import isEmpty from "lodash/isEmpty";

const props = defineProps<{
  title?: string;
  value?: string | number;
}>();

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
