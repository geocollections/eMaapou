<template>
  <tr v-if="!isInvalid || hasValueSlot">
    <td class="font-weight-medium">{{ title }}</td>
    <td>
      <slot name="value">
        {{ value }}
      </slot>
    </td>
  </tr>
</template>

<script>
import isNil from 'lodash/isNil'

export default {
  name: 'TableRow',
  props: {
    title: { type: String, default: null },
    value: {
      type: null,
      default: null,
      required: false,
    },
  },
  computed: {
    isInvalid() {
      return isNil(this.value)
    },
    hasValueSlot() {
      return this.$slots.value
    },
  },
}
</script>
