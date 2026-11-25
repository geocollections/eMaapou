<script setup lang="ts">
import { mdiChevronRight, mdiHomeOutline, mdiOpenInNew } from "@mdi/js";
import { SERVICES } from "~/constants";

definePageMeta({ layout: false });

const { t } = useI18n();
const localePath = useLocalePath();
const homeLabel = computed(() => t("portal.common.home"));
const servicesLabel = computed(() => t("portal.services.eServices"));
type ServiceId = typeof SERVICES.ids[number];

const groups = computed(() => {
  const copy: {
    introduction: string;
    external: string;
    browse: string;
    explore: string;
    photo: string;
    groups: {
      id: string;
      title: string;
      description: string;
      ids: ServiceId[];
    }[];
  } = {
    introduction: t("portal.services.introduction"),
    external: t("portal.services.external"),
    browse: t("portal.services.browse"),
    explore: t("portal.services.explore"),
    photo: t("portal.services.photo"),
    groups: [
      {
        id: "collections",
        title: t("portal.services.groups.collections.title"),
        description: t("portal.services.groups.collections.description"),
        ids: [
          "geocollections",
          "kirjandus",
          "fossiilid",
          "kivid",
          "stratigraphy",
          "gmre",
          "geocase",
        ],
      },
      {
        id: "maps",
        title: t("portal.services.groups.maps.title"),
        description: t("portal.services.groups.maps.description"),
        ids: ["geologicalSurvey", "maardlad", "turba"],
      },
      {
        id: "research",
        title: t("portal.services.groups.research.title"),
        description: t("portal.services.groups.research.description"),
        ids: ["fond", "doi", "eurocore", "sarv"],
      },
    ],
  };

  return {
    ...copy,
    groups: copy.groups.map(group => ({
      ...group,
      services: group.ids.map(id => SERVICES[id]),
    })),
  };
});
</script>

<template>
  <div class="flex min-h-screen flex-col bg-portal-background font-sans text-portal-text">
    <AppBar />
    <main class="mx-auto w-full max-w-7xl flex-1 px-4 pt-6 pb-10 sm:px-6 lg:px-8 lg:pb-12">
      <nav
        :aria-label="t('portal.common.breadcrumb')"
        class="mb-6 flex items-center gap-2 text-[13px] text-portal-muted"
      >
        <ULink
          :to="localePath('/')"
          raw
          class="header-focus inline-flex min-h-6 items-center gap-2 text-portal-text hover:text-portal-link"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-4"
            aria-hidden="true"
          >
            <path :d="mdiHomeOutline" />
          </svg>
          {{ homeLabel }}
        </ULink>
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-4"
          aria-hidden="true"
        >
          <path :d="mdiChevronRight" />
        </svg>
        <span aria-current="page">{{ servicesLabel }}</span>
      </nav>

      <section
        aria-labelledby="services-title"
        class="mb-8 grid items-stretch gap-6 md:grid-cols-[1.2fr_1fr] md:gap-8"
      >
        <div>
          <h1
            id="services-title"
            class="mb-4 font-sans text-[32px] leading-[1.15] font-bold tracking-[-0.035em] text-portal-heading md:text-4xl"
          >
            {{ t("services.title") }}
          </h1>
          <p class="max-w-170 text-base leading-relaxed">
            {{ groups.introduction }}
          </p>
          <nav class="mt-6" :aria-label="groups.explore">
            <p class="mb-2 text-sm font-semibold text-portal-heading">
              {{ groups.explore }}
            </p>
            <ul class="flex list-none flex-wrap gap-2 p-0">
              <li v-for="group in groups.groups" :key="group.id">
                <a
                  :href="`#services-${group.id}`"
                  class="header-focus inline-flex min-h-11 items-center gap-1 rounded-portal-control border border-portal-border bg-portal-background px-3 text-sm font-medium text-portal-link no-underline transition-colors hover:border-portal-border-hover hover:bg-portal-subtle"
                >
                  {{ group.title }}
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    class="size-4 rotate-90"
                  >
                    <path :d="mdiChevronRight" />
                  </svg>
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <img
          src="https://files.geocollections.info/large/df1971c7-30f0-4cb5-bfc4-0839fe78edc0.jpg"
          :alt="groups.photo"
          width="2000"
          height="1333"
          class="h-52 w-full rounded-portal-card object-cover md:h-full md:max-h-90 md:min-h-64"
          fetchpriority="high"
        >
      </section>

      <div class="space-y-10">
        <section
          v-for="group in groups.groups"
          :id="`services-${group.id}`"
          :key="group.title"
          :aria-labelledby="`services-heading-${group.id}`"
          class="scroll-mt-24"
        >
          <div class="mb-4 border-b border-portal-border pb-3 sm:mb-5">
            <h2
              :id="`services-heading-${group.id}`"
              class="mb-2 font-sans text-[22px] leading-snug font-semibold tracking-tight text-portal-heading md:text-2xl"
            >
              {{ group.title }}
            </h2>
            <p class="text-sm leading-relaxed text-portal-text">
              {{ group.description }}
            </p>
          </div>

          <ul class="grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
            <li v-for="service in group.services" :key="service.href">
              <a
                :href="service.href"
                target="_blank"
                rel="noopener noreferrer"
                class="group flex h-full min-h-37 flex-col rounded-portal-card border border-portal-border bg-portal-background p-5 text-portal-text no-underline transition-colors hover:border-portal-border-hover hover:bg-portal-subtle focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-portal-focus"
              >
                <span class="flex items-start justify-between gap-4">
                  <span class="text-lg leading-snug font-semibold text-portal-heading group-hover:text-portal-link">
                    {{ t(service.title) }}
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    class="mt-0.5 size-5 shrink-0 text-portal-link"
                  >
                    <path :d="mdiOpenInNew" />
                  </svg>
                </span>
                <span class="mt-2 text-sm leading-relaxed text-portal-text">
                  {{ t(service.description) }}
                </span>
                <span class="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-portal-link">
                  {{ groups.browse }}
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    class="size-4 transition-transform group-hover:translate-x-0.5"
                  >
                    <path :d="mdiChevronRight" />
                  </svg>
                  <span class="sr-only">({{ groups.external }})</span>
                </span>
              </a>
            </li>
          </ul>
        </section>
      </div>
    </main>
    <AppFooter />
  </div>
</template>
