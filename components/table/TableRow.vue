<script setup lang="ts" generic="T">
import isEmpty from "lodash/isEmpty";

const props = defineProps<{
  title?: string;
  value: T;
}>();

const isInvalid = computed(() => {
  if (typeof props.value === "number")
    return false;
  return isEmpty(props.value);
});
</script>

<template>
  <tr v-if="!isInvalid">
    <td class="font-weight-medium">
      {{ title }}
    </td>
    <td>
      <slot name="value" :value="value">
        {{ value }}
      </slot>
    </td>
  </tr>
</template>
