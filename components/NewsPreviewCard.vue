<template>
  <v-card
    elevation="0"
    color="transparent"
    v-bind="$attrs"
    @click.stop="$emit('click')"
  >
    <div class="pl-4 montserrat" :class="{ 'white--text': dark }">
      {{ formatDate(date) }}
    </div>
    <v-card-title
      class="montserrat pt-0"
      :class="{ 'white--text': dark }"
      style="word-break: normal"
      >{{ title }}</v-card-title
    >

    <v-card-text
      class="montserrat pb-0"
      :class="{ 'white--text': dark }"
      v-html="$options.filters.truncate(extractContent(content), previewLenght)"
    >
    </v-card-text>

    <v-card-actions class="justify-self-end pb-0">
      <v-spacer />
      <v-btn :color="dark ? 'white' : 'black'" text @click="$emit('click')">
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
    dark: { type: Boolean, default: false },
    title: { type: String, default: null },
    content: { type: String, default: null },
    date: { type: String, default: null },
    previewLenght: { type: Number, default: 200 },
  },
  methods: {
    extractContent(html) {
      if (html) return html.replace(/<[^>]+>/g, '')
      return null
    },
    formatDate(isoDateTime) {
      return new Date(isoDateTime).toISOString().split('T')[0]
    },
  },
}
</script>
