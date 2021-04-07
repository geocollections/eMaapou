<template>
  <data-row v-if="value" :title="title">
    <template #value>
      <nuxt-link v-if="nuxt" class="text-link" :to="href">{{
        value
      }}</nuxt-link>
      <span v-else>
        <a v-if="href" class="text-link" :href="href">
          <slot name="value">
            {{ value }}
          </slot>
        </a>
        <external-link v-else @click.native="$emit('link-click')">
          {{ value }}
        </external-link>
      </span>
      <span v-if="suffix">{{ suffix }}</span>
    </template>
  </data-row>
</template>

<script>
import DataRow from '@/components/DataRow'
import ExternalLink from '~/components/ExternalLink'

export default {
  name: 'LinkDataRow',
  components: { ExternalLink, DataRow },
  props: {
    nuxt: { type: Boolean, default: false },
    title: { type: String, default: null },
    value: { type: [String, Number], default: null, required: false },
    href: { type: String, default: null },
    suffix: { type: String, default: null },
  },
}
</script>
