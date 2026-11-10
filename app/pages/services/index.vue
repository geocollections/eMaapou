<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

const otherServices = ref({
  geocollections: {
    title: "geocollections.title",
    description: "geocollections.description",
    href: "https://geocollections.info",
  },
  kirjandus: {
    title: "kirjandus.title",
    description: "kirjandus.description",
    href: "https://kirjandus.geoloogia.info",
  },
  gmre: {
    title: "gmre.title",
    description: "gmre.description",
    href: "https://geoloogia.info/geology",
  },
  fond: {
    title: "fond.title",
    description: "fond.description",
    href: "https://fond.egt.ee",
  },
  fossiilid: {
    title: "fossiilid.title",
    description: "fossiilid.description",
    href: "https://fossiilid.info",
  },
  kivid: {
    title: "kivid.title",
    description: "kivid.description",
    href: "https://kivid.info",
  },
  stratigraphy: {
    title: "frontStratigraphy.title",
    description: "frontStratigraphy.description",
    href: "https://stratotuup.ut.ee",
  },
  geologicalSurvey: {
    title: "geologicalSurvey.title",
    description: "geologicalSurvey.description",
    href: "https://gis.egt.ee/",
  },
  maardlad: {
    title: "maardlad.title",
    description: "maardlad.description",
    href: "https://xgis.maaamet.ee/xgis2/page/app/geoloogia400k",
  },
  doi: {
    title: "doi.title",
    description: "doi.description",
    href: "https://doi.geocollections.info",
  },
  turba: {
    title: "turba.title",
    description: "turba.description",
    href: "https://turba.geoloogia.info",
  },
  // Divider
  geocase: {
    title: "geocase.title",
    description: "geocase.description",
    href: "https://geocase.eu",
  },
  eurocore: {
    title: "eurocore.title",
    description: "eurocore.description",
    href: "https://eurocore.rocks",
  },
  sarv: {
    title: "sarv.title",
    description: "sarv.description",
    href: "https://edit.geocollections.info",
  },
});

const items = computed<BreadcrumbItem[]>(() => [
  {
    label: t('title'),
    icon: 'i-lucide-home',
    to: '/'
  },
  {
    label: t('services.title'),
    to: '/services'
  }
])
const favicons = ref<Record<string, string>>({})

const { t } = useI18n();

// We asynchronously get the favicons when the page loads to show a custom question mark
// for websites that favicons aren't available/can't load for some god damned reason
function getFavicon(href: string): Promise<string> {
  const fallback =
    'data:image/svg+xml,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><text x="50%" y="50%" dy=".35em" text-anchor="middle" font-size="26" fill="gray">?</text></svg>'
    )

  return new Promise((resolve) => {
    const favicon = new URL('/favicon.ico', href).href
    const image = new Image()

    image.onload = () => resolve(favicon)
    image.onerror = () => resolve(fallback)
    image.src = favicon
  })
}


onMounted(async () => {
  await Promise.all(
    Object.values(otherServices.value).map(async ({ href }) => {
      favicons.value[href] = await getFavicon(href)
    })
  )
})

</script>
<template>
    <div>
        <UBreadcrumb :items="items" />
        <h1 class="mt-12 text-4xl font-bold">{{ t('services.title') }}</h1>
        <p class="mt-2 mb-24">{{ t('services.sub') }}</p>
        <div class="grid grid-cols-3 gap-6">
            <UCard
            v-for="value in otherServices"
            :key="value.href"
            :ui="{ body: 'flex items-start gap-8' }"
            >

            <img
            v-if="favicons[value.href]"
            :src="favicons[value.href]"
            :alt="t(value.title)"
            class="size-8 shrink-0"
            />

            <div>
                <h2 class="text-xl font-bold">{{ t(value.title) }}</h2>
                <p class="text-sm">{{ t(value.description) }}</p>
                <NuxtLink
                :to="value.href"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1 mt-3 text-link!"
                >
                {{ t('services.link') }}
                <UIcon
                    name="i-lucide-arrow-up-right"
                    class="size-5 text-link!"
                />
                </NuxtLink>
            </div>
            </UCard>
        </div>
    </div>
</template>
