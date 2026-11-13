<script setup lang="ts">
import { decodeHTML } from "entities";
import { mdiArrowRight } from "@mdi/js";
import type { NewsArticle } from "~/types/api";

const props = defineProps<{
  article: NewsArticle;
  page?: number;
  filters?: { q?: string; field?: string };
  headingTag?: "h2" | "h3";
}>();
const { locale } = useI18n();
const localePath = useLocalePath();
const en = computed(() => locale.value === "en");
const title = computed(
  () =>
    (en.value
      ? props.article.title_en || props.article.title_et
      : props.article.title_et || props.article.title_en) ||
    (en.value ? "Untitled news" : "Pealkirjata uudis"),
);
const titleLanguage = computed(() =>
  en.value && props.article.title_en
    ? "en"
    : props.article.title_et
      ? "et"
      : "en",
);
const content = computed(() =>
  en.value
    ? props.article.text_en || props.article.text_et
    : props.article.text_et || props.article.text_en,
);
const preview = computed(() => {
  const plain = decodeHTML((content.value || "").replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
  if (plain.length <= 260) return plain;
  const cut = plain.slice(0, 260);
  const boundary = cut.lastIndexOf(" ");
  return `${cut.slice(0, boundary > 180 ? boundary : 260)}…`;
});
const date = computed(() => {
  if (!props.article.date_published) return null;
  const value = new Date(props.article.date_published);
  if (Number.isNaN(value.getTime())) return null;
  return new Intl.DateTimeFormat(en.value ? "en-GB" : "et-EE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(value);
});
</script>

<template>
  <article
    class="border-b border-portal-border py-6 first:pt-0 last:border-b-0 md:py-8"
  >
    <ULink
      raw
      :to="
        localePath({
          name: 'news-id',
          params: { id: article.id },
          query: { ...filters, ...(page && page > 1 ? { page } : {}) },
        })
      "
      class="header-focus group grid gap-3 rounded-portal-control text-portal-text no-underline md:grid-cols-[140px_minmax(0,1fr)] md:gap-8"
    >
      <div class="pt-1 text-sm leading-relaxed text-portal-muted tabular-nums">
        <time v-if="date" :datetime="article.date_published || undefined">{{
          date
        }}</time>
      </div>
      <div class="min-w-0">
        <component
          :is="headingTag || 'h2'"
          :lang="titleLanguage"
          class="mb-3 text-lg leading-snug font-semibold tracking-tight text-portal-heading group-hover:text-portal-link group-hover:underline group-hover:underline-offset-4 md:text-[22px]"
        >
          {{ title }}
        </component>
        <p
          v-if="preview"
          :lang="en && article.text_en ? 'en' : article.text_et ? 'et' : 'en'"
          class="text-base leading-relaxed"
        >
          {{ preview }}
        </p>
        <div
          class="mt-4 flex min-h-11 w-fit items-center gap-2 text-sm font-semibold text-portal-link [text-decoration-line:underline] underline-offset-4"
        >
          {{ en ? "Read article" : "Loe uudist" }}
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            class="size-4 shrink-0 transition-transform motion-safe:group-hover:translate-x-1"
          >
            <path :d="mdiArrowRight" />
          </svg>
        </div>
      </div>
    </ULink>
  </article>
</template>
