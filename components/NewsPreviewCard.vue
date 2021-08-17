<template>
  <v-card
    elevation="0"
    color="transparent"
    v-bind="$attrs"
    @click.stop="$emit('click')"
  >
    <div class="pl-4 montserrat" :class="{ 'white--text': dark }">
      {{ $formatDate(date) }}
    </div>
    <v-card-title
      class="montserrat pt-0"
      :class="{ 'white--text': dark }"
      style="word-break: normal"
      >{{ title }}</v-card-title
    >

    <v-card-text
      class="pb-0"
      :class="{ 'white--text': dark }"
      v-html="$options.filters.truncate(extractContent(content), previewLenght)"
    >
    </v-card-text>

    <v-card-actions class="justify-self-end py-0">
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
    // BUG: If unicode character is at the end of the truncated text
    // The unicode will get split into two and and ugly artifacts remain.
    // Should parse unicode before truncating
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
  },
}
</script>
