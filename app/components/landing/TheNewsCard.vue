<script setup lang="ts">
import { mdiChevronRight } from "@mdi/js";
import { decodeHTML } from "entities";

interface HomeNews {
  id: number;
  title_et: string | null;
  title_en: string | null;
  text_et: string | null;
  text_en: string | null;
  date_published: string | null;
}
const { locale } = useI18n();
const localePath = useLocalePath();
const en = computed(() => locale.value === "en");
const copy = computed(() =>
  en.value
    ? {
        title: "News",
        all: "All news",
        loading: "Loading news…",
        empty: "No news to display.",
        error: "News could not be loaded.",
        retry: "Try again",
        untitled: "Untitled news",
      }
    : {
        title: "Uudised",
        all: "Kõik uudised",
        loading: "Laadin uudiseid…",
        empty: "Uudiseid ei ole kuvada.",
        error: "Uudiste laadimine ebaõnnestus.",
        retry: "Proovi uuesti",
        untitled: "Pealkirjata uudis",
      },
);
const { data, status, error, refresh } = await useApiFetch<
  GeoloogiaListResponse<HomeNews>
>("/web-news/", {
  query: { limit: 2, ordering: "-date_added" },
  timeout: 8000,
  retry: 0,
  lazy: true,
});
const failedImages = ref(new Set<number>());
const articles = computed(() =>
  (data.value?.results || []).map((article) => {
    const title
      = (en.value
        ? article.title_en || article.title_et
        : article.title_et || article.title_en) || copy.value.untitled;
    const content
      = (en.value
        ? article.text_en || article.text_et
        : article.text_et || article.text_en) || "";
    const excerpt = decodeHTML(content.replace(/<[^>]*>/g, " "))
      .replace(/\s+/g, " ")
      .trim();
    const imageMatch = content.match(
      /<img\b[^>]*?\ssrc\s*=\s*["']([^"']+)["']/i,
    );
    let image: string | undefined;
    if (imageMatch?.[1]) {
      try {
        const url = new URL(
          decodeHTML(imageMatch[1]),
          "https://geoloogia.info",
        );
        if (["https:", "http:"].includes(url.protocol))
          image = url.href;
      }
      catch {
        /* Omit images with invalid URLs. */
      }
    }
    let date: string | undefined;
    if (article.date_published) {
      const value = new Date(article.date_published);
      if (!Number.isNaN(value.getTime())) {
        date = new Intl.DateTimeFormat(en.value ? "en-GB" : "et-EE", {
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: "UTC",
        }).format(value);
      }
    }
    return {
      id: article.id,
      title,
      excerpt,
      image,
      date,
      datetime: article.date_published || undefined,
      titleLanguage:
        en.value && article.title_en
          ? "en"
          : article.title_et ? "et" : "en",
      textLanguage:
        en.value && article.text_en
          ? "en"
          : article.text_et ? "et" : "en",
    };
  }),
);
</script>

<template>
  <UCard
    as="section"
    aria-labelledby="home-news-title"
    :ui="{
      root: 'h-full rounded-portal-card bg-transparent shadow-none ring-0 divide-portal-border',
      header: 'p-0 pb-4 sm:p-0 sm:pb-4',
      body: 'p-0 pt-2 sm:p-0 sm:pt-2',
    }"
  >
    <template #header>
      <div class="flex items-center justify-between gap-3">
        <h2
          id="home-news-title"
          class="text-[22px] font-semibold tracking-tight text-portal-heading md:text-2xl"
        >
          {{ copy.title }}
        </h2>
        <ULink
          raw
          :to="localePath({ name: 'news' })"
          class="header-focus inline-flex min-h-11 shrink-0 items-center gap-1 rounded-portal-control text-sm font-medium text-portal-link hover:underline hover:underline-offset-4"
        >
          {{ copy.all
          }}<svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            class="size-4"
          >
            <path :d="mdiChevronRight" /></svg>
        </ULink>
      </div>
    </template>
    <div
      v-if="status === 'pending'"
      role="status"
      class="space-y-5"
    >
      <span class="sr-only">{{ copy.loading }}</span>
      <div
        v-for="item in 2"
        :key="item"
        aria-hidden="true"
        class="space-y-3"
      >
        <USkeleton class="h-5 w-4/5 bg-portal-subtle" /><USkeleton
          class="h-4 w-28 bg-portal-subtle"
        /><USkeleton class="h-4 w-full bg-portal-subtle" />
      </div>
    </div>
    <div v-else-if="error" role="status">
      <p class="mb-3 text-sm leading-relaxed">
        {{ copy.error }}
      </p>
      <UButton
        color="neutral"
        variant="outline"
        class="header-focus min-h-11 rounded-portal-control border-portal-border text-sm text-portal-link"
        @click="refresh()"
      >
        {{ copy.retry }}
      </UButton>
    </div>
    <ul
      v-else-if="articles.length"
      class="m-0 list-none divide-y divide-portal-border p-0"
    >
      <li
        v-for="article in articles"
        :key="article.id"
        class="py-2 first:pt-0 last:pb-0"
      >
        <article>
          <ULink
            raw
            :to="localePath({ name: 'news-id', params: { id: article.id } })"
            class="header-focus group -mx-3 flex items-start gap-4 rounded-portal-control px-3 py-4 text-portal-text no-underline transition-colors hover:bg-portal-subtle"
          >
            <img
              v-if="article.image && !failedImages.has(article.id)"
              :src="article.image"
              alt=""
              width="96"
              height="80"
              loading="lazy"
              class="h-20 w-24 shrink-0 rounded-portal-control object-cover"
              @error="failedImages.add(article.id)"
            >
            <div class="min-w-0 flex-1">
              <time
                v-if="article.date"
                :datetime="article.datetime"
                class="mb-2 block text-[13px] text-portal-muted tabular-nums"
              >{{ article.date }}</time>
              <h3
                :lang="article.titleLanguage"
                class="line-clamp-2 text-lg leading-snug font-semibold tracking-tight text-portal-heading group-hover:text-portal-link group-hover:underline group-hover:underline-offset-4"
              >
                {{ article.title }}
              </h3>
              <p
                v-if="article.excerpt"
                :lang="article.textLanguage"
                class="mt-2 line-clamp-1 text-sm leading-relaxed text-portal-muted"
              >
                {{ article.excerpt }}
              </p>
            </div>
          </ULink>
        </article>
      </li>
    </ul>
    <p
      v-else
      role="status"
      class="text-sm text-portal-muted"
    >
      {{ copy.empty }}
    </p>
  </UCard>
</template>
