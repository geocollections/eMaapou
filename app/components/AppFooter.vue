<script setup lang="ts">
import { mdiOpenInNew } from "@mdi/js";
import {
  BROWSE_GEOLOGY_LIST,
  BROWSE_LAB_LIST,
  BROWSE_TAXON_LIST,
  SERVICES,
} from "~/constants";

const { locale, t } = useI18n();
const localePath = useLocalePath();
const copy = computed(() =>
  locale.value === "en"
    ? {
        subtitle: "Estonian geological data portal",
        collections: "Data collections",
        research: "Research & places",
        services: "External services",
        about: "About the portal",
        policies: "Data & source code",
        portal: "About the portal",
        news: "News",
        search: "Search all data",
        api: "SARV API",
        source: "Source code",
        partners: "Partners & infrastructure",
        privacyTitle: "Privacy & analytics",
        reuseTitle: "Using the data",
        licence:
          "Unless otherwise indicated, portal materials are generally available under the CC BY-SA 3.0 licence. Check each record’s source and licence before reuse.",
        licenceLink: "Read the licence",
        external: "External website",
      }
    : {
        subtitle: "Eesti geoloogiliste andmete portaal",
        collections: "Andmekogud",
        research: "Teadusandmed ja paigad",
        services: "Välised teenused",
        about: "Portaalist",
        policies: "Andmed ja lähtekood",
        portal: "Portaalist",
        news: "Uudised",
        search: "Otsi kõigist andmetest",
        api: "SARVe API",
        source: "Lähtekood",
        partners: "Partnerid ja taristu",
        privacyTitle: "Privaatsus ja analüütika",
        reuseTitle: "Andmete kasutamine",
        licence:
          "Kui pole märgitud teisiti, on portaali materjalid üldjuhul kasutatavad CC BY-SA 3.0 litsentsi alusel. Enne taaskasutust kontrolli kirje allikat ja litsentsi.",
        licenceLink: "Loe litsentsi",
        external: "Väline veebileht",
      },
);

type FooterLink = { label: string; to: string; external?: boolean };
const dataLink = (item: { routeName: string; label: string }): FooterLink => ({
  label: t(item.label),
  to: localePath({ name: item.routeName }),
});
const groups = computed(() => [
  {
    id: "collections",
    title: copy.value.collections,
    links: [...BROWSE_TAXON_LIST, ...BROWSE_LAB_LIST.slice(0, 1)].map(dataLink),
  },
  {
    id: "research",
    title: copy.value.research,
    links: [...BROWSE_LAB_LIST.slice(1), ...BROWSE_GEOLOGY_LIST].map(dataLink),
  },
  {
    id: "services",
    title: copy.value.services,
    links: (
      [
        "kirjandus",
        "fossiilid",
        "kivid",
        "fond",
        "eurocore",
        "geocollections",
        "sarv",
      ] as const
    ).map((id) => ({
      label: t(SERVICES[id].title),
      to: SERVICES[id].href,
      external: true,
    })),
  },
  {
    id: "about",
    title: copy.value.about,
    links: [
      { label: copy.value.portal, to: localePath({ name: "about" }) },
      { label: copy.value.news, to: localePath({ name: "news" }) },
      { label: copy.value.search, to: localePath({ name: "search" }) },
    ],
  },
  {
    id: "policies",
    title: copy.value.policies,
    links: [
      {
        label: "CC BY-SA 3.0",
        to: "https://creativecommons.org/licenses/by-sa/3.0/",
        external: true,
      },
      {
        label: copy.value.api,
        to: "https://api.geoloogia.info",
        external: true,
      },
      {
        label: copy.value.source,
        to: "https://github.com/geocollections/eMaapou",
        external: true,
      },
    ],
  },
]);
const partners = [
  {
    href: "https://geocollections.info",
    src: "/logos/sarv_logo.svg",
    alt: "footerLinks.sarv",
    width: 172,
    height: 60,
  },
  {
    href: "https://natarc.ut.ee",
    src: "/logos/natarc_logo_black.svg",
    alt: "footerLinks.natarc",
    width: 60,
    height: 60,
  },
  {
    href: "https://taltech.ee/geoloogia-instituut",
    src: "/logos/taltech_black.png",
    alt: "footerLinks.ttu",
    width: 105,
    height: 60,
  },
  {
    href: "https://natmuseum.ut.ee",
    src: "/logos/Tartu_Ülikool_logo.png",
    alt: "footerLinks.tu",
    width: 58,
    height: 60,
  },
  {
    href: "https://loodusmuuseum.ee/geoloogilised-kogud",
    src: "/logos/eesti_loodusmuuseum.png",
    alt: "footerLinks.elm",
    width: 127,
    height: 60,
  },
];
</script>

<template>
  <footer
    class="border-t border-portal-border bg-portal-background font-sans text-portal-text"
  >
    <UContainer
      class="w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8 lg:pt-10"
    >
      <div class="grid gap-8 xl:grid-cols-[200px_minmax(0,1fr)] xl:gap-10">
        <div>
          <ULink
            raw
            :to="localePath('/')"
            class="header-focus inline-flex items-center rounded-portal-control text-portal-heading no-underline"
            aria-label="eMaapõu"
          >
            <span
              class="text-xl font-bold tracking-[-1.2px] min-[380px]:text-[22px] min-[700px]:text-2xl min-[960px]:text-[28px]"
              >eMaapõu</span
            >
          </ULink>
          <p class="mt-3 max-w-52 text-sm leading-relaxed text-portal-muted">
            {{ copy.subtitle }}
          </p>
        </div>
        <div
          class="grid min-w-0 grid-cols-1 gap-x-6 gap-y-6 min-[360px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
        >
          <nav
            v-for="group in groups"
            :key="group.id"
            :aria-labelledby="`footer-${group.id}-title`"
            class="min-w-0"
          >
            <h2
              :id="`footer-${group.id}-title`"
              class="mb-3 text-sm leading-normal font-semibold text-portal-heading"
            >
              {{ group.title }}
            </h2>
            <ul class="m-0 list-none p-0">
              <li v-for="link in group.links" :key="link.to">
                <ULink
                  raw
                  :to="link.to"
                  :external="link.external || link.to.startsWith('#')"
                  :target="link.external ? '_blank' : undefined"
                  :rel="link.external ? 'noopener noreferrer' : undefined"
                  class="flex min-h-11 w-fit items-start gap-2 rounded-portal-control py-2 text-sm leading-normal text-portal-text no-underline underline-offset-3 hover:text-portal-link hover:underline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-portal-focus lg:min-h-8 lg:py-1"
                >
                  <span>{{ link.label }}</span>
                  <svg
                    v-if="link.external"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    class="mt-0.5 size-3.5 shrink-0 text-portal-muted"
                  >
                    <path :d="mdiOpenInNew" />
                  </svg>
                  <span v-if="link.external" class="sr-only"
                    >({{ copy.external }})</span
                  >
                </ULink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <section
        class="mt-8 flex flex-col gap-5 border-t border-portal-border pt-6 md:flex-row md:items-center md:gap-8"
        aria-labelledby="footer-partners-title"
      >
        <h2
          id="footer-partners-title"
          class="shrink-0 text-sm font-semibold text-portal-heading"
        >
          {{ copy.partners }}
        </h2>
        <ul
          class="m-0 flex list-none flex-wrap items-center gap-x-8 gap-y-5 p-0"
        >
          <li v-for="partner in partners" :key="partner.href">
            <ULink
              raw
              :href="partner.href"
              target="_blank"
              rel="noopener noreferrer"
              class="header-focus inline-flex min-h-11 items-center rounded-portal-control"
              :aria-label="`${$t(partner.alt)} (${copy.external})`"
            >
              <img
                :src="partner.src"
                :alt="$t(partner.alt)"
                :width="partner.width"
                :height="partner.height"
                class="h-9 w-auto max-w-32 object-contain"
                loading="lazy"
              />
            </ULink>
          </li>
        </ul>
      </section>
      <div
        class="mt-6 grid gap-6 border-t border-portal-border pt-6 text-[13px] leading-relaxed md:grid-cols-2 md:gap-10"
      >
        <section
          id="footer-privacy"
          class="scroll-mt-24"
          aria-labelledby="footer-privacy-title"
        >
          <h2
            id="footer-privacy-title"
            class="mb-2 text-sm font-semibold text-portal-heading"
          >
            {{ copy.privacyTitle }}
          </h2>
          <I18nT keypath="privacyNotice" scope="global" tag="p"
            ><ULink
              raw
              href="https://matomo.org"
              class="header-focus text-portal-link underline underline-offset-2"
              >Matomo</ULink
            ></I18nT
          >
        </section>
        <section
          id="footer-reuse"
          class="scroll-mt-24"
          aria-labelledby="footer-reuse-title"
        >
          <h2
            id="footer-reuse-title"
            class="mb-2 text-sm font-semibold text-portal-heading"
          >
            {{ copy.reuseTitle }}
          </h2>
          <p>
            {{ copy.licence }}
            <ULink
              raw
              href="https://creativecommons.org/licenses/by-sa/3.0/"
              class="header-focus text-portal-link underline underline-offset-2"
              >{{ copy.licenceLink }}</ULink
            >
          </p>
        </section>
      </div>
    </UContainer>
  </footer>
</template>
