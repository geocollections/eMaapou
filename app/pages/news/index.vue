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
            class="mt-6 flex flex-col gap-4 border-t border-portal-border pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
          >
            <p class="text-sm text-portal-muted tabular-nums" role="status">
              {{ firstVisible }}–{{ lastVisible }} / {{ data.count }}
              {{ articleLabel }}
            </p>
            <div class="flex items-center justify-between gap-2 sm:justify-end">
              <UButton
                color="neutral"
                variant="outline"
                :disabled="page <= 1"
                class="header-focus min-h-11 shrink-0 gap-1 rounded-portal-control border border-portal-border bg-portal-background px-3 text-sm text-portal-heading shadow-none hover:bg-portal-subtle disabled:opacity-40"
                @click="changePage(page - 1)"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  class="size-4 shrink-0"
                >
                  <path :d="mdiChevronLeft" />
                </svg>
                {{ copy.previous }}
              </UButton>
              <span
                class="text-sm text-portal-heading tabular-nums sm:hidden"
                aria-live="polite"
                >{{ copy.page }} {{ page }} / {{ pageCount }}</span
              >
              <UPagination
                class="hidden sm:block"
                :page="page"
                :total="data.count"
                :items-per-page="perPage"
                :sibling-count="1"
                :show-edges="true"
                :show-controls="false"
                :ui="{ list: 'gap-1' }"
                @update:page="changePage"
              >
                <template #item="{ item }">
                  <UButton
                    color="neutral"
                    variant="ghost"
                    :aria-label="`${en ? 'Page' : 'Lehekülg'} ${item.value}`"
                    :aria-current="page === item.value ? 'page' : undefined"
                    class="header-focus size-11 justify-center rounded-portal-control border text-sm font-medium tabular-nums shadow-none"
                    :class="
                      page === item.value
                        ? 'border-portal-primary bg-portal-primary text-white hover:bg-portal-primary-hover'
                        : 'border-transparent bg-transparent text-portal-heading hover:border-portal-border hover:bg-portal-subtle'
                    "
                    >{{ item.value }}</UButton
                  >
                </template>
                <template #ellipsis
                  ><span
                    aria-hidden="true"
                    class="flex size-11 items-center justify-center text-portal-muted"
                    >…</span
                  ></template
                >
              </UPagination>
              <UButton
                color="neutral"
                variant="outline"
                :disabled="page >= pageCount"
                class="header-focus min-h-11 shrink-0 gap-1 rounded-portal-control border border-portal-border bg-portal-background px-3 text-sm text-portal-heading shadow-none hover:bg-portal-subtle disabled:opacity-40"
                @click="changePage(page + 1)"
              >
                {{ copy.next }}
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  class="size-4 shrink-0"
                >
                  <path :d="mdiChevronRight" />
                </svg>
              </UButton>
            </div>
          </nav>
        </template>
      </section>
    </UContainer>
    <AppFooter />
  </div>
</template>
