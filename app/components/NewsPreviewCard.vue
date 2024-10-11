<script setup lang="ts">
import { decodeHTML } from "entities";

const props = withDefaults(defineProps<{
  to: string;
  title: Nullable<string>;
  content: Nullable<string>;
  date: Nullable<string>;
  dark?: boolean;
  previewLenght?: number;
}>(), {
  dark: false,
  previewLenght: 200,
});

const truncatedText = computed(() => {
  if (!props.content)
    return "";

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
  <div
    class="py-2"
    flat
    :to="to"
  >
    <div
      v-if="date"
      class="text-right pr-4 montserrat text--secondary"
      :class="{ 'white--text': dark }"
    >
      {{ $formatDate(date) }}
    </div>
    <div
      class="pt-0 text-h6"
      :class="{ 'white--text': dark }"
      style="word-break: normal"
    >
      {{ title }}
    </div>

    <div
      class="pb-0 text-body-1"
      style="color: rgba(0, 0, 0, 0.7)"
      :class="{ 'white--text': dark }"
    >
      {{ truncatedText }}
    </div>
  </div>
</template>
