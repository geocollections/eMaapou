<template>
  <tr v-if="value || hasValueSlot">
    <td>{{ title }}</td>
    <td>
      <slot name="value">
        {{ value }}
      </slot>
    </td>
  </tr>
</template>

<script>
import { isNil } from 'lodash'

export default {
  name: 'DataRow',
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
