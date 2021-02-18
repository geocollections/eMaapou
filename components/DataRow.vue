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
import { isNil, isEmpty } from 'lodash'

export default {
  name: 'DataRow',
  props: {
    title: { type: String, default: null },
    value: {
      type: [String, Number, Boolean],
      default: '',
      required: false,
    },
  },
  computed: {
    isInvalid() {
      if (typeof this.value === 'string') {
        return isEmpty(this.value)
      }

      return isNil(this.value)
    },
  },
}
</script>
