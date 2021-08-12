<template>
  <v-card elevation="0" color="transparent" v-bind="$attrs">
    <div class="pl-4 white--text montserrat">
      {{ formatDate(date) }}
    </div>
    <v-card-title
      class="montserrat white--text pt-0"
      style="word-break: normal"
      >{{ title }}</v-card-title
    >

    <v-card-text
      class="montserrat white--text pb-0"
      v-html="$options.filters.truncate(extractContent(content), 200)"
    >
    </v-card-text>

    <v-card-actions class="justify-self-end">
      <v-spacer />
      <v-btn color="white" text @click="$emit('click')">
        {{ $t('common.readNewsArticle') }}</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'NewsPreviewCard',
  filters: {
    truncate(value, length) {
      if (!value) return ''
      value = value.toString()
      if (value.length > length) {
        return value.substring(0, length) + '...'
      } else {
        return value
      }
    },
  },
  props: {
    title: { type: String, default: null },
    content: { type: String, default: null },
    date: { type: String, default: null },
  },
  methods: {
    extractContent(html) {
      // BUG: Does not handle unicode characters
      return html.replace(/<[^>]+>/g, '')
    },
    formatDate(isoDateTime) {
      return new Date(isoDateTime).toISOString().split('T')[0]
    },
  },
}
</script>
