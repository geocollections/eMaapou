<template>
  <v-hover v-slot="{ hover }">
    <v-card
      v-bind="$attrs"
      class="py-2"
      :elevation="hover ? 2 : 1"
      @click.stop="$emit('click')"
    >
      <div
        class="text-right pr-4 montserrat text--secondary"
        :class="{ 'white--text': dark }"
      >
        {{ $formatDate(date) }}
      </div>
      <v-card-title
        class="montserrat pt-0"
        :class="{ 'white--text': dark }"
        style="word-break: normal"
      >
        {{ title }}
      </v-card-title>

      <v-card-text
        class="pb-0 text-body-1"
        style="color: rgba(0, 0, 0, 0.7)"
        :class="{ 'white--text': dark }"
      >
        {{ extractContent(content) | truncate(previewLenght) }}
      </v-card-text>

      <v-card-actions class="justify-self-end py-0">
        <v-spacer />
        <v-btn
          :color="dark ? 'white' : 'accent'"
          class="text-none"
          text
          @click="$emit('click')"
        >
          {{ $t('common.readNewsArticle') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-hover>
</template>

<script>
import { decode } from 'html-entities'
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
      if (html) {
        return decode(html).replace(/<[^>]+>/g, '')
      }
      return null
    },
  },
}
</script>
