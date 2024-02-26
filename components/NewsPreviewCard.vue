<script setup lang="ts">
import { decodeHTML } from "entities";

const props = defineProps({
  dark: { type: Boolean, default: false },
  title: { type: String, default: null },
  content: { type: String, default: null },
  date: { type: String, default: null },
  previewLenght: { type: Number, default: 200 },
});
const truncatedText = computed(() => {
  let value = extractContent(props.content);
  if (!value)
    return "";
  value = value.toString();
  if (value.length > props.previewLenght)
    return `${value.substring(0, props.previewLenght)}...`;
  else
    return value;
});

function extractContent(html: string) {
  if (html)
    return decodeHTML(html).replace(/<[^>]+>/g, "");

  return null;
}
</script>

<template>
  <VHover v-slot="{ hover }">
    <VCard
      v-bind="$attrs"
      class="py-2"
      flat
      :color="hover ? 'grey lighten-4' : 'transparent'"
      @click.stop="$emit('click')"
    >
      <div
        class="text-right pr-4 montserrat text--secondary"
        :class="{ 'white--text': dark }"
      >
        {{ $formatDate(date) }}
      </div>
      <VCardTitle
        class="pt-0 text-h6"
        :class="{ 'white--text': dark }"
        style="word-break: normal"
      >
        {{ title }}
      </VCardTitle>

      <VCardText
        class="pb-0 text-body-1"
        style="color: rgba(0, 0, 0, 0.7)"
        :class="{ 'white--text': dark }"
      >
        {{ truncatedText }}
      </VCardText>
    </VCard>
  </VHover>
</template>
