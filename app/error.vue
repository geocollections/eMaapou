<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{
  error: NuxtError;
}>();

const { t } = useI18n();
const localePath = useLocalePath();
const query = ref("");
const statusCode = computed(() => props.error.statusCode || 500);
const copy = computed(() => {
  if (statusCode.value === 404) {
    return {
      title: t("portal.error.notFound.title"),
      description: t("portal.error.notFound.description"),
    };
  }

  if (statusCode.value === 400) {
    return {
      title: t("portal.error.badRequest.title"),
      description: t("portal.error.badRequest.description"),
    };
  }

  if (statusCode.value >= 500) {
    return {
      title: t("portal.error.serverError.title"),
      description: t("portal.error.serverError.description"),
    };
  }

  return {
    title: t("portal.error.fallback.title"),
    description: t("portal.error.fallback.description"),
  };
});
const searchLabel = computed(() => t("portal.common.searchAll"));
const homeLabel = computed(() => t("portal.error.backToHomepage"));

useHead(() => ({
  title: `${copy.value.title} (${statusCode.value})`,
}));

function returnHome() {
  clearError({
    redirect: localePath("/"),
  });
}

function search() {
  const value = query.value.trim();
  if (!value)
    return;

  clearError({
    redirect: localePath({
      name: "search",
      query: { q: value },
    }),
  });
}
</script>

<template>
  <VApp class="flex min-h-dvh flex-col bg-portal-background font-sans text-portal-text">
    <AppBar />
    <main class="flex flex-1 items-center px-4 py-12 sm:px-6 lg:px-8">
      <UContainer class="w-full max-w-3xl">
        <section
          aria-labelledby="error-title"
          class="overflow-hidden rounded-portal-card border border-portal-border bg-portal-background shadow-[0_24px_64px_-40px_rgba(16,33,58,0.4)]"
        >
          <div class="grid md:grid-cols-[0.85fr_1.15fr]">
            <div class="relative flex min-h-64 flex-col justify-center overflow-hidden bg-portal-mint/60 px-7 py-9 sm:px-10 md:min-h-110">
              <div aria-hidden="true" class="pointer-events-none absolute -right-24 -bottom-28 size-80 rounded-full border border-portal-primary/15">
                <div class="absolute inset-7 rounded-full border border-portal-primary/15">
                  <div class="absolute inset-7 rounded-full border border-portal-primary/15" />
                </div>
              </div>
              <div class="relative z-10">
                <p class="m-0 text-lg font-semibold tracking-[-0.02em] text-portal-heading sm:text-xl">
                  {{ t('portal.error.error') }}
                </p>
                <p class="m-0 mt-2 text-[clamp(6rem,16vw,9rem)] leading-[0.82] font-bold tracking-[-0.08em] text-portal-primary tabular-nums">
                  {{ statusCode }}
                </p>
              </div>
            </div>
            <div class="flex min-w-0 flex-col justify-center p-6 sm:p-9 lg:p-11">
              <p class="mb-2 text-[11px] font-semibold tracking-[0.14em] text-portal-muted uppercase">
                {{ t('portal.error.aLittleDetour') }}
              </p>
              <h1 id="error-title" class="m-0 text-3xl leading-tight font-semibold tracking-tight text-portal-heading sm:text-4xl">
                {{ copy.title }}
              </h1>
              <p class="mt-3 mb-0 max-w-xl text-sm leading-relaxed text-portal-muted sm:text-base">
                {{ copy.description }}
              </p>
              <UButton
                type="button"
                color="primary"
                class="mt-7 min-h-11 w-fit rounded-portal-control bg-portal-primary px-4 font-semibold text-white hover:bg-portal-primary-hover"
                @click="returnHome"
              >
                {{ homeLabel }}
              </UButton>
              <form
                class="mt-8 max-w-xl border-t border-portal-border pt-6"
                role="search"
                @submit.prevent="search"
              >
                <label for="error-search" class="mb-2 block text-sm font-medium text-portal-heading">
                  {{ searchLabel }}
                </label>
                <div class="flex gap-2">
                  <UInput
                    id="error-search"
                    v-model="query"
                    type="search"
                    color="neutral"
                    variant="outline"
                    :placeholder="t('portal.error.searchSpecimensPlacesCollections')"
                    class="min-w-0 flex-1"
                    :ui="{ base: 'h-11 rounded-portal-control border border-portal-border bg-portal-background text-sm text-portal-text ring-0 placeholder:text-portal-muted focus-visible:ring-2 focus-visible:ring-portal-focus' }"
                  />
                  <UButton
                    type="submit"
                    color="primary"
                    square
                    icon="i-lucide-search"
                    class="flex! size-11! min-h-11! w-11! shrink-0! items-center! justify-center! rounded-portal-control bg-portal-primary p-0! text-white hover:bg-portal-primary-hover"
                    :aria-label="searchLabel"
                  />
                </div>
              </form>
            </div>
          </div>
        </section>
      </UContainer>
    </main>
    <AppFooter />
  </VApp>
</template>
