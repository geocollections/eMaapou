<script setup lang="ts">
import { mdiArrowLeft, mdiChevronRight, mdiHomeOutline } from "@mdi/js";
import type { NewsArticle } from "~/types/api";

definePageMeta({ layout: false });
const route = useRoute();
const localePath = useLocalePath();
const { locale } = useI18n();
const en = computed(() => locale.value === "en");
const copy = computed(() =>
  en.value
    ? {
        home: "Home",
        news: "News",
        back: "Back to news",
        other: "More news",
        all: "View all news",
        loading: "Loading article…",
        error: "The article could not be loaded. Please try again.",
        missing: "Article not found",
        missingText:
          "This news article is unavailable. Browse the news list for other articles.",
        noContent: "The article text is not available.",
        retry: "Try again",
        untitled: "Untitled news",
      }
    : {
        home: "Avaleht",
        news: "Uudised",
        back: "Tagasi uudiste juurde",
        other: "Veel uudiseid",
        all: "Vaata kõiki uudiseid",
        loading: "Laadin uudist…",
        error: "Uudise laadimine ebaõnnestus. Palun proovi uuesti.",
        missing: "Uudist ei leitud",
        missingText:
          "See uudis ei ole kättesaadav. Teiste uudiste lugemiseks ava uudiste loend.",
        noContent: "Uudise tekst ei ole saadaval.",
        retry: "Proovi uuesti",
        untitled: "Pealkirjata uudis",
      },
);
const returnPage = computed(() => {
  const value = Number(route.query.page);
  return Number.isSafeInteger(value) && value > 1 ? value : undefined;
});
const returnFilters = computed(() => {
  const keyword = typeof route.query.q === "string" ? route.query.q.trim() : "";
  return {
    q: keyword || undefined,
    field: keyword && route.query.field === "content" ? "content" : undefined,
  };
});
const backTo = computed(() =>
  localePath({
    name: "news",
    query: {
      ...returnFilters.value,
      ...(returnPage.value ? { page: returnPage.value } : {}),
    },
  }),
);
const {
  data: news,
  status,
  error,
  refresh,
} = await useApiFetch<NewsArticle>(() => `/web-news/${route.params.id}`, {
  timeout: 15000,
  retry: 0,
});
const missing = computed(
  () =>
    error.value?.statusCode === 404 ||
    (!news.value && !error.value && status.value === "success"),
);
const title = computed(() =>
  missing.value
    ? copy.value.missing
    : (en.value
        ? news.value?.title_en || news.value?.title_et
        : news.value?.title_et || news.value?.title_en) || copy.value.untitled,
);
const content = computed(() =>
  en.value
    ? news.value?.text_en || news.value?.text_et
    : news.value?.text_et || news.value?.text_en,
);
const contentLanguage = computed(() =>
  en.value && news.value?.text_en ? "en" : news.value?.text_et ? "et" : "en",
);
const titleLanguage = computed(() =>
  en.value && news.value?.title_en ? "en" : news.value?.title_et ? "et" : "en",
);
const date = computed(() => {
  if (!news.value?.date_published) return null;
  const value = new Date(news.value.date_published);
  return Number.isNaN(value.getTime())
    ? null
    : new Intl.DateTimeFormat(en.value ? "en-GB" : "et-EE", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }).format(value);
});
const { data: otherNewsList } = await useApiFetch<
  GeoloogiaListResponse<NewsArticle>
>("/web-news/", {
  query: { limit: 6, ordering: "-date_added" },
  timeout: 15000,
  retry: 0,
});
const otherNews = computed(() =>
  (otherNewsList.value?.results || [])
    .filter((article) => article.id !== Number(route.params.id))
    .slice(0, 3),
);
useHead(() => ({ title: `${title.value} | ${copy.value.news}` }));
</script>

<template>
  <div
    class="flex min-h-screen flex-col bg-portal-background font-sans text-portal-text"
  >
    <AppBar
      class="max-[700px]:[&>div]:gap-0 max-[700px]:[&>div]:px-1 max-[700px]:[&_.header-control]:px-1"
    />
    <UContainer
      as="main"
      class="w-full max-w-3xl flex-1 px-4 pt-6 pb-10 sm:px-6 lg:px-8 lg:pb-12"
    >
      <nav
        :aria-label="en ? 'Breadcrumb' : 'Asukoharada'"
        class="mb-5 flex min-w-0 items-center gap-2 text-[13px] text-portal-muted"
      >
        <ULink
          raw
          :to="localePath('/')"
          class="header-focus inline-flex min-h-6 shrink-0 items-center gap-2 text-portal-text hover:text-portal-link"
          ><svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            class="size-4"
          >
            <path :d="mdiHomeOutline" /></svg
          >{{ copy.home }}</ULink
        >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          class="size-4 shrink-0"
        >
          <path :d="mdiChevronRight" />
        </svg>
        <ULink
          raw
          :to="backTo"
          class="header-focus shrink-0 text-portal-text hover:text-portal-link"
          >{{ copy.news }}</ULink
        >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          class="size-4 shrink-0"
        >
          <path :d="mdiChevronRight" />
        </svg>
        <span class="truncate" aria-current="page">{{ title }}</span>
      </nav>
      <ULink
        raw
        :to="backTo"
        class="header-focus mb-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-portal-link hover:underline"
        ><svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          class="size-4"
        >
          <path :d="mdiArrowLeft" /></svg
        >{{ copy.back }}</ULink
      >
      <div v-if="status === 'pending'" role="status" class="space-y-5 py-4">
        <span class="sr-only">{{ copy.loading }}</span
        ><USkeleton class="h-10 w-3/4 bg-portal-subtle" /><USkeleton
          class="h-5 w-32 bg-portal-subtle"
        /><USkeleton
          v-for="line in 5"
          :key="line"
          class="h-4 w-full bg-portal-subtle"
        />
      </div>
      <section v-else-if="missing" class="py-4">
        <h1 class="mb-4 text-[28px] font-bold text-portal-heading md:text-4xl">
          {{ copy.missing }}
        </h1>
        <p class="mb-4 leading-relaxed">{{ copy.missingText }}</p>
        <UButton
          :to="backTo"
          color="neutral"
          variant="outline"
          class="header-control border border-portal-border"
          >{{ copy.all }}</UButton
        >
      </section>
      <div
        v-else-if="error"
        role="alert"
        class="rounded-portal-card border border-portal-border p-6"
      >
        <h1 class="mb-4 text-2xl font-semibold text-portal-heading">
          {{ copy.news }}
        </h1>
        <p class="mb-4">{{ copy.error }}</p>
        <UButton
          color="neutral"
          variant="outline"
          class="header-control border border-portal-border"
          @click="refresh()"
          >{{ copy.retry }}</UButton
        >
      </div>
      <template v-else-if="news">
        <article aria-labelledby="news-title" class="w-full">
          <header class="mb-8 border-b border-portal-border pb-6 md:pb-8">
            <h1
              id="news-title"
              :lang="titleLanguage"
              class="mb-5 text-[28px] leading-tight font-bold tracking-tight text-portal-heading md:text-4xl"
            >
              {{ title }}
            </h1>
            <time
              v-if="date"
              :datetime="news.date_published || undefined"
              class="text-sm text-portal-muted tabular-nums"
              >{{ date }}</time
            >
          </header>
          <div
            v-if="content"
            :lang="contentLanguage"
            class="text-base leading-relaxed break-words [&_a]:text-portal-link [&_a]:underline [&_a]:underline-offset-4 [&_a:focus-visible]:outline-3 [&_a:focus-visible]:outline-offset-3 [&_a:focus-visible]:outline-portal-focus [&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-portal-border [&_blockquote]:pl-5 [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-portal-heading [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-portal-heading [&_img]:my-6 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-portal-card [&_li]:mb-2 [&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-5 [&_table]:my-6 [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_td]:border [&_td]:border-portal-border [&_td]:p-3 [&_th]:border [&_th]:border-portal-border [&_th]:bg-portal-subtle [&_th]:p-3 [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-6"
            v-html="content"
          />
          <p v-else class="leading-relaxed text-portal-muted">
            {{ copy.noContent }}
          </p>
        </article>
        <section
          v-if="otherNews.length"
          aria-labelledby="other-news-title"
          class="mt-10 border-t border-portal-border pt-8 md:mt-12"
        >
          <div class="mb-8 flex flex-wrap items-center justify-between gap-3">
            <h2
              id="other-news-title"
              class="text-[22px] font-semibold tracking-tight text-portal-heading md:text-2xl"
            >
              {{ copy.other }}
            </h2>
            <ULink
              raw
              :to="backTo"
              class="header-focus inline-flex min-h-11 items-center text-sm font-medium text-portal-link [text-decoration-line:underline] underline-offset-4"
              >{{ copy.all }}</ULink
            >
          </div>
          <NewsArticlePreview
            v-for="article in otherNews"
            :key="article.id"
            :article="article"
            heading-tag="h3"
            :page="returnPage"
            :filters="returnFilters"
          />
        </section>
      </template>
    </UContainer>
    <AppFooter />
  </div>
</template>
