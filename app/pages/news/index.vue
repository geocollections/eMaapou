<script setup lang="ts">
import type { NewsArticle } from "~/types/api";
import {
  mdiChevronLeft,
  mdiChevronRight,
  mdiClose,
  mdiHomeOutline,
  mdiMagnify,
} from "@mdi/js";

definePageMeta({ layout: false });
const route = useRoute();
const router = useRouter();
const localePath = useLocalePath();
const { locale, t } = useI18n();
const en = computed(() => locale.value === "en");
const copy = computed(() => ({
  home: t("portal.common.home"),
  title: t("portal.newsSearch.title"),
  intro: t("portal.newsSearch.intro"),
  articles: t("portal.newsSearch.articles"),
  loading: t("portal.newsSearch.loading"),
  error: t("portal.newsSearch.error"),
  retry: t("portal.common.retry"),
  empty: t("portal.newsSearch.empty"),
  first: t("portal.newsSearch.first"),
  pagination: t("portal.newsSearch.pagination"),
  previous: t("portal.common.previous"),
  next: t("portal.common.next"),
  page: t("portal.newsSearch.page"),
  keyword: t("portal.newsSearch.keyword"),
  placeholder: t("portal.newsSearch.placeholder"),
  searchIn: t("portal.newsSearch.searchIn"),
  inTitle: t("portal.newsSearch.inTitle"),
  inContent: t("portal.newsSearch.inContent"),
  search: t("portal.newsSearch.search"),
  clear: t("portal.newsSearch.clear"),
  remove: t("portal.common.removeFilter"),
  titleFilter: t("portal.newsSearch.titleFilter"),
  contentFilter: t("portal.newsSearch.contentFilter"),
  noMatches: t("portal.newsSearch.noMatches"),
}));
const perPage = 5;
const page = computed(() => {
  const value = Number(route.query.page);
  return Number.isSafeInteger(value) && value > 0
    ? value
    : 1;
});
type SearchField = "title" | "content";
const searchTerm = computed(() =>
  typeof route.query.q === "string"
    ? route.query.q.trim()
    : "",
);
const searchField = computed<SearchField>(() =>
  route.query.field === "content"
    ? "content"
    : "title",
);
const draftKeyword = ref(searchTerm.value);
const draftField = ref<SearchField>(searchField.value);
watch([searchTerm, searchField], ([keyword, field]) => {
  draftKeyword.value = keyword;
  draftField.value = field;
});
const listFilters = computed(() => ({
  q: searchTerm.value || undefined,
  field:
    searchTerm.value && searchField.value === "content"
      ? "content"
      : undefined,
}));
const query = computed(() => ({
  offset: (page.value - 1) * perPage,
  limit: perPage,
  ordering: "-date_added",
  ...(searchTerm.value
    ? {
        [`${searchField.value === "content"
          ? "text"
          : "title"}_${en.value ? "en" : "et"}__icontains`]:
          searchTerm.value,
      }
    : {}),
}));
async function applyFilters() {
  const keyword = draftKeyword.value.trim();
  await router.push({
    query: {
      ...route.query,
      q: keyword || undefined,
      field: keyword && draftField.value === "content"
        ? "content"
        : undefined,
      page: undefined,
    },
  });
}
async function clearFilters() {
  draftKeyword.value = "";
  draftField.value = "title";
  await router.push({
    query: {
      ...route.query,
      q: undefined,
      field: undefined,
      page: undefined,
    },
  });
}
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
    ? t("portal.newsSearch.article")
    : copy.value.articles,
);
const pageCount = computed(() =>
  Math.max(1, Math.ceil((data.value?.count || 0) / perPage)),
);
const firstVisible = computed(() =>
  articles.value.length
    ? (page.value - 1) * perPage + 1
    : 0,
);
const lastVisible = computed(() =>
  Math.min(
    (page.value - 1) * perPage + articles.value.length,
    data.value?.count || 0,
  ),
);
async function changePage(value: number) {
  if (
    !Number.isInteger(value)
    || value < 1
    || value > pageCount.value
    || value === page.value
  ) {
    return;
  }
  await router.push({
    query: {
      ...route.query,
      page: value > 1
        ? String(value)
        : undefined,
    },
    hash: "#news-list",
  });
}
useHead(() => ({ title: copy.value.title }));
</script>

<template>
  <div
    class="portal-page-shell"
  >
    <AppBar
      class="portal-responsive-header"
    />
    <UContainer
      as="main"
      class="portal-news-container"
    >
      <nav
        :aria-label="t('portal.common.breadcrumb')"
        class="portal-breadcrumbs"
      >
        <ULink
          raw
          :to="localePath('/')"
          class="portal-breadcrumb-link header-focus"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            class="size-4"
          >
            <path :d="mdiHomeOutline" /></svg>{{ copy.home }}
        </ULink>
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
      <header class="portal-page-heading">
        <h1
          class="portal-page-title"
        >
          {{ copy.title }}
        </h1>
        <p class="text-base leading-relaxed">
          {{ copy.intro }}
        </p>
      </header>
      <form
        class="mb-8"
        role="search"
        :aria-label="copy.search"
        @submit.prevent="applyFilters"
      >
        <div
          class="portal-news-search"
        >
          <div class="min-w-0">
            <label
              for="news-keyword"
              class="portal-field-label"
            >{{ copy.keyword }}</label>
            <UInput
              id="news-keyword"
              v-model="draftKeyword"
              :placeholder="copy.placeholder"
              type="search"
              class="w-full"
              color="neutral"
              variant="outline"
              :ui="{
                base: 'h-11 rounded-portal-control bg-portal-background text-base text-portal-text ring-portal-border focus-visible:ring-2 focus-visible:ring-portal-focus',
              }"
            />
          </div>
          <div class="min-w-0">
            <label
              for="news-search-field"
              class="portal-field-label"
            >{{ copy.searchIn }}</label>
            <USelect
              id="news-search-field"
              v-model="draftField"
              :items="[
                { label: copy.inTitle, value: 'title' },
                { label: copy.inContent, value: 'content' },
              ]"
              class="w-full"
              color="neutral"
              variant="outline"
              :ui="{
                base: 'h-11 rounded-portal-control bg-portal-background text-base text-portal-text ring-portal-border focus-visible:ring-2 focus-visible:ring-portal-focus',
                content: 'z-[1200] bg-portal-background',
              }"
            />
          </div>
          <UButton
            type="submit"
            color="neutral"
            variant="solid"
            class="portal-search-button header-focus"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              class="size-5 shrink-0"
            >
              <path :d="mdiMagnify" /></svg>{{ copy.search }}
          </UButton>
        </div>
        <div v-if="searchTerm" class="portal-active-filters">
          <UButton
            type="button"
            color="neutral"
            variant="soft"
            :aria-label="`${copy.remove}: ${searchTerm}`"
            class="portal-filter-chip header-focus"
            @click="clearFilters"
          >
            <span class="min-w-0 wrap-break-word">{{
              searchField === "content"
                ? copy.contentFilter
                : copy.titleFilter
            }}: {{ searchTerm }}</span>
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              class="size-4 shrink-0"
            >
              <path :d="mdiClose" />
            </svg>
          </UButton>
          <UButton
            type="button"
            color="neutral"
            variant="ghost"
            class="portal-clear-button header-focus"
            @click="clearFilters"
          >
            {{ copy.clear }}
          </UButton>
        </div>
      </form>
      <section
        id="news-list"
        :aria-label="copy.title"
        :aria-busy="status === 'pending'"
        class="scroll-mt-24"
      >
        <div
          v-if="status === 'pending'"
          role="status"
          class="space-y-6 py-4"
        >
          <span class="sr-only">{{ copy.loading }}</span>
          <div
            v-for="item in 3"
            :key="item"
            aria-hidden="true"
            class="portal-news-item"
          >
            <USkeleton class="portal-date-skeleton" />
            <div class="space-y-3">
              <USkeleton class="portal-title-skeleton" /><USkeleton
                class="portal-line-skeleton"
              /><USkeleton class="portal-short-line-skeleton" />
            </div>
          </div>
        </div>
        <div
          v-else-if="error"
          role="alert"
          class="portal-empty-card"
        >
          <p class="mb-4">
            {{ copy.error }}
          </p>
          <UButton
            color="neutral"
            variant="outline"
            class="portal-outline-button header-control"
            @click="refresh()"
          >
            {{ copy.retry }}
          </UButton>
        </div>
        <template v-else>
          <p
            v-if="data && data.count > 0"
            class="portal-results-count"
          >
            {{ data.count }} {{ articleLabel }}
          </p>
          <div v-if="articles.length">
            <NewsArticlePreview
              v-for="article in articles"
              :key="article.id"
              :article="article"
              :page="page"
              :filters="listFilters"
            />
          </div>
          <div
            v-else
            role="status"
            class="py-8"
          >
            <p>{{ searchTerm ? copy.noMatches : copy.empty }}</p>
            <ULink
              v-if="page > 1"
              raw
              :to="localePath({ name: 'news', query: listFilters })"
              class="portal-read-more header-focus"
            >
              {{ copy.first }}
            </ULink>
          </div>
          <nav
            v-if="data && data.count > perPage"
            :aria-label="copy.pagination"
            class="portal-news-pagination"
          >
            <p class="portal-page-count" role="status">
              {{ firstVisible }}–{{ lastVisible }} / {{ data.count }}
              {{ articleLabel }}
            </p>
            <div class="portal-pagination-controls">
              <UButton
                color="neutral"
                variant="outline"
                :disabled="page <= 1"
                class="portal-page-arrow header-focus"
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
                class="portal-mobile-page-count"
                aria-live="polite"
              >{{ copy.page }} {{ page }} / {{ pageCount }}</span>
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
                    v-if="item.type === 'page'"
                    color="neutral"
                    variant="ghost"
                    :aria-label="t('portal.newsSearch.pagePage', { page: item.value })"
                    :aria-current="page === item.value ? 'page' : undefined"
                    class="portal-page-number header-focus"
                    :class="
                      page === item.value
                        ? 'border-portal-primary bg-portal-primary text-white hover:bg-portal-primary-hover'
                        : 'border-transparent bg-transparent text-portal-heading hover:border-portal-border hover:bg-portal-subtle'
                    "
                  >
                    {{ item.value }}
                  </UButton>
                </template>
                <template #ellipsis>
                  <span
                    aria-hidden="true"
                    class="portal-page-ellipsis"
                  >…</span>
                </template>
              </UPagination>
              <UButton
                color="neutral"
                variant="outline"
                :disabled="page >= pageCount"
                class="portal-page-arrow"
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
