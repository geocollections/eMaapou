<template>
  <data-row :title="title" :value="value">
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
        <a v-else class="text-link" @click="$emit('link-click')">
          {{ value }}
          <v-icon small color="deep-orange darken-2">mdi-open-in-new</v-icon>
        </a>
      </span>
      <span v-if="suffix">{{ suffix }}</span>
    </template>
  </data-row>
</template>

<script>
import DataRow from '@/components/DataRow'

export default {
  name: 'LinkDataRow',
  components: { DataRow },
  props: {
    nuxt: { type: Boolean, default: false },
    title: { type: String, default: null },
    value: { type: [String, Number], default: null, required: false },
    href: { type: String, default: null },
    suffix: { type: String, default: null },
  },
}
</script>
