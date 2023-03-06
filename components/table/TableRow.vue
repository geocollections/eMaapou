<template>
  <tr v-if="!isInvalid || hasValueInSlot">
    <td class="font-weight-medium">{{ title }}</td>
    <td>
      <slot name="value">
        {{ value }}
      </slot>
    </td>
  </tr>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api'
import isEmpty from 'lodash/isEmpty'

export default defineComponent({
  name: 'TableRow',
  props: {
    title: { type: String, default: null },
    value: {
      type: [String, Number] as PropType<string | number>,
      default: null,
      required: false,
    },
  },
  setup(props, { slots }) {
    const isInvalid = computed(() => {
      if (typeof props.value === 'number') return false
      return isEmpty(props.value)
    })
    const hasValueInSlot = computed(() => {
      return slots.value
    })
    return { isInvalid, hasValueInSlot }
  },
})
</script>
