<template>
  <tr>
    <td>{{ title }}</td>
    <td v-if="isInvalid" class="no-value">
      {{ $t('common.noValue') }}
    </td>
    <td v-else>
      <nuxt-link v-if="nuxt" class="text-link underline" :to="href">{{
        value
      }}</nuxt-link>
      <div v-else>
        <a v-if="href" class="text-link" :href="href"> {{ value }} </a>
        <a v-else class="text-link" @click="$emit('link-click')"
          >{{ value }}
        </a>
      </div>
    </td>
  </tr>
</template>

<script>
import { isNil, isEmpty } from 'lodash'

export default {
  name: 'LinkDataRow',
  props: {
    nuxt: { type: Boolean, default: false },
    title: { type: String, default: null },
    value: { type: [String, Number], default: null, required: true },
    href: { type: String, default: null },
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
