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
  <VHover v-slot="{ isHovering, props: hoverProps }">
    <NuxtLink
      v-bind="{ ...$attrs, ...hoverProps }"
      class="px-4 py-2 rounded text-decoration-none"
      :class="isHovering ? 'bg-grey-lighten-4' : 'bg-transparent'"
      :to="to"
    >
      <div
        v-if="date"
        class="text-right montserrat text-grey-darken-1"
        :class="{ 'text-white': dark }"
      >
        {{ $formatDate(date) }}
      </div>
      <div
        class="text-h6 text-grey-darken-3 pb-2"
        style="word-break: normal"
      >
        {{ title }}
      </div>

      <div
        class="pb-0 text-body-1 text-grey-darken-2"
        :class="{ 'text-white': dark }"
      >
        {{ truncatedText }}
      </div>
    </NuxtLink>
  </VHover>
</template>
