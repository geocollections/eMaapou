<template>
  <td v-if="isValid" class="no-value">
    {{ $t('common.noValue') }}
  </td>
  <td v-else>
    {{ value }}
  </td>
</template>

<script>
import { isNil, isEmpty } from 'lodash'

export default {
  name: 'DataCell',
  props: {
    value: { type: [String, Number], default: null, required: true },
  },
  computed: {
    isValid() {
      if (typeof this.value === 'string') {
        return isEmpty(this.value)
      }

      return isNil(this.value)
    },
  },
}
</script>
