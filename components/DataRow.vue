<template>
  <tr>
    <td>{{ title }}</td>
    <td v-if="isInvalid" class="no-value">
      {{ $t('common.noValue') }}
    </td>
    <td v-else>
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
  },
}
</script>
