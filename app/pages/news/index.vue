<script setup lang="ts">
import { mdiChevronLeft, mdiChevronRight, mdiHomeOutline } from "@mdi/js";
import type { NewsArticle } from "~/types/api";

definePageMeta({ layout: false });
const route = useRoute();
const router = useRouter();
const localePath = useLocalePath();
const { locale } = useI18n();
const en = computed(() => locale.value === "en");
const copy = computed(() =>
  en.value
    ? {
        home: "Home",
        title: "News",
        intro: "Updates from the portal and the world of geology.",
        articles: "articles",
        loading: "Loading news…",
        error: "News could not be loaded. Please try again.",
        retry: "Try again",
        empty: "No news to display.",
        first: "Back to the first page",
        pagination: "News pages",
        previous: "Previous",
        next: "Next",
        page: "Page",
      }
    : {
        home: "Avaleht",
        title: "Uudised",
        intro: "Uuendused portaalist ja uudised geoloogia valdkonnast.",
        articles: "uudist",
        loading: "Laadin uudiseid…",
        error: "Uudiste laadimine ebaõnnestus. Palun proovi uuesti.",
        retry: "Proovi uuesti",
        empty: "Uudiseid ei ole kuvada.",
        first: "Tagasi esimesele lehele",
        pagination: "Uudiste leheküljed",
        previous: "Eelmine",
        next: "Järgmine",
        page: "Leht",
      },
);
const perPage = 5;
const page = computed(() => {
  const value = Number(route.query.page);
  return Number.isSafeInteger(value) && value > 0 ? value : 1;
});
const query = computed(() => ({
  offset: (page.value - 1) * perPage,
  limit: perPage,
  ordering: "-date_added",
}));
const { data, status, error, refresh } = await useApiFetch<
  GeoloogiaListResponse<NewsArticle>
>("/web-news/", {
  query,
  timeout: 15000,
  retry: 0,
});
const articles = computed(() => data.value?.results || []);
const articleLabel = computed(() =>
  data.value?.count === 1
    ? en.value
      ? "article"
      : "uudis"
    : copy.value.articles,
);
const pageCount = computed(() =>
  Math.max(1, Math.ceil((data.value?.count || 0) / perPage)),
);
const firstVisible = computed(() =>
  articles.value.length ? (page.value - 1) * perPage + 1 : 0,
);
const lastVisible = computed(() =>
  Math.min(
    (page.value - 1) * perPage + articles.value.length,
    data.value?.count || 0,
  ),
);
async function changePage(value: number) {
  if (
    !Number.isInteger(value) ||
    value < 1 ||
    value > pageCount.value ||
    value === page.value
  )
    return;
  await router.push({
    query: { ...route.query, page: value > 1 ? String(value) : undefined },
    hash: "#news-list",
  });
}
useHead(() => ({ title: copy.value.title }));
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
      class="w-full max-w-7xl flex-1 px-4 pt-6 pb-10 sm:px-6 lg:px-8 lg:pb-12"
    >
      <nav
        :aria-label="en ? 'Breadcrumb' : 'Asukoharada'"
        class="mb-6 flex items-center gap-2 text-[13px] text-portal-muted"
      >
        <ULink
          raw
          :to="localePath('/')"
          class="header-focus inline-flex min-h-6 items-center gap-2 text-portal-text hover:text-portal-link"
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
          class="size-4"
        >
          <path :d="mdiChevronRight" />
        </svg>
        <span aria-current="page">{{ copy.title }}</span>
      </nav>
      <header class="mb-8 border-b border-portal-border pb-6 md:mb-10 md:pb-8">
        <h1
          class="mb-3 text-[28px] leading-tight font-bold tracking-tight text-portal-heading md:text-4xl"
        >
          {{ copy.title }}
        </h1>
        <p class="text-base leading-relaxed">{{ copy.intro }}</p>
      </header>
      <section
        id="news-list"
        :aria-label="copy.title"
        :aria-busy="status === 'pending'"
        class="max-w-5xl scroll-mt-24"
      >
        <div v-if="status === 'pending'" role="status" class="space-y-6 py-4">
          <span class="sr-only">{{ copy.loading }}</span>
          <div
            v-for="item in 3"
            :key="item"
            aria-hidden="true"
            class="grid gap-4 border-b border-portal-border pb-6 md:grid-cols-[140px_1fr] md:gap-8"
          >
            <USkeleton class="h-5 w-28 bg-portal-subtle" />
            <div class="space-y-3">
              <USkeleton class="h-6 w-3/4 bg-portal-subtle" /><USkeleton
                class="h-4 w-full bg-portal-subtle"
              /><USkeleton class="h-4 w-2/3 bg-portal-subtle" />
            </div>
          </div>
        </div>
        <div
          v-else-if="error"
          role="alert"
          class="rounded-portal-card border border-portal-border p-6"
        >
          <p class="mb-4">{{ copy.error }}</p>
          <UButton
            color="neutral"
            variant="outline"
            class="header-control border border-portal-border"
            @click="refresh()"
            >{{ copy.retry }}</UButton
          >
        </div>
        <template v-else>
          <p
            v-if="data && data.count > 0"
            class="mb-6 text-sm text-portal-muted tabular-nums"
          >
            {{ data.count }} {{ articleLabel }}
          </p>
          <div v-if="articles.length">
            <NewsArticlePreview
              v-for="article in articles"
              :key="article.id"
              :article="article"
              :page="page"
            />
          </div>
          <div v-else role="status" class="py-8">
            <p>{{ copy.empty }}</p>
            <ULink
              v-if="page > 1"
              raw
              :to="localePath({ name: 'news' })"
              class="header-focus mt-4 inline-flex min-h-11 items-center text-portal-link [text-decoration-line:underline] underline-offset-4"
              >{{ copy.first }}</ULink
            >
          </div>
          <nav
            v-if="data && data.count > perPage"
            :aria-label="copy.pagination"
            class="mt-6 border-t border-portal-border pt-6"
          >
            <UPagination
              :page="page"
              :total="data.count"
              :items-per-page="perPage"
              :sibling-count="1"
              :show-edges="false"
              active-color="neutral"
              active-variant="soft"
              color="neutral"
              variant="ghost"
              :ui="{ item: 'min-h-11 min-w-11' }"
              @update:page="changePage"
            />
          </nav>
        </template>
      </section>
    </UContainer>
    <AppFooter />
  </div>
</template>
