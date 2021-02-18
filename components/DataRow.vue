<template>
  <tr>
    <td>{{ title }}</td>
    <td v-if="isInvalid" class="no-value">
      {{ $t('common.noValue') }}
    </td>
    <td v-else>
      {{ value }}
    </td>
  </tr>
</template>

<script>
import { isNil, isEmpty } from 'lodash'

export default {
  name: 'DataRow',
  props: {
    title: { type: String, default: null },
    value: { type: [String, Number], default: null, required: true },
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
