<script setup lang="ts">
import { mdiChevronRight } from "@mdi/js";

const localePath = useLocalePath();

const logo = "/logos/emaapou5orange.svg";
const imageLinks = [
  {
    href: "https://geocollections.info",
    src: "/logos/sarv_logo.svg",
    title: "footerLinks.sarv",
    alt: "footerLinks.sarv",
    format: null,
    width: 172,
    height: 60,
  },
  {
    href: "https://natarc.ut.ee",
    src: "/logos/natarc_logo_black.svg",
    title: "footerLinks.natarc",
    alt: "footerLinks.natarc",
    format: "webp",
    width: 60,
    height: 60,
  },
  {
    href: "https://taltech.ee/geoloogia-instituut",
    src: "/logos/taltech_black.png",
    title: "footerLinks.ttu",
    alt: "footerLinks.ttu",
    format: "webp",
    height: 60,
    width: 105,
  },
  {
    href: "http://www.natmuseum.ut.ee/et/content/geoloogiakogud",
    src: "/logos/Tartu_Ülikool_logo.png",
    title: "footerLinks.tu",
    alt: "footerLinks.tu",
    format: "webp",
    width: 58,
    height: 60,
  },
  {
    href: "https://loodusmuuseum.ee/geoloogilised-kogud",
    src: "/logos/eesti_loodusmuuseum.png",
    title: "footerLinks.elm",
    alt: "footerLinks.elm",
    format: "webp",
    height: 60,
    width: 127,
  },
  /* {
          href: 'https://struktuurifondid.ee',
          src: '/logos/EL_mv.png',
          title: 'footerLinks.el',
          alt: 'footerLinks.el',
        }, */
];
const textLinks = [
  {
    href: "https://creativecommons.org/licenses/by-sa/3.0/",
    text: "CC BY-SA",
  },
  {
    href: "https://natarc.ut.ee/",
    text: "NATARC",
  },
  {
    href: "https://geocollections.info/",
    text: "SARV",
  },
  {
    href: "https://taltech.ee/geoloogia-instituut",
    text: "TalTech",
  },
  {
    href: "https://nuxtjs.org/",
    text: "Nuxt.js",
  },
  {
    href: "https://github.com/geocollections/EMA",
    text: "GitHub",
  },
];
const links = [
  { name: "geocollections.title", url: "https://geocollections.info" },
  { name: "kirjandus.title", url: "https://kirjandus.geoloogia.info" },
  { name: "gmre.title", url: "https://geoloogia.info/geology" },
  { name: "fond.title", url: "https://fond.egt.ee" },
  { name: "fossiilid.title", url: "https://fossiilid.info" },
  { name: "kivid.title", url: "https://kivid.info" },
  { name: "stratigraphy.title", url: "http://stratigraafia.info" },
  {
    name: "maardlad.title",
    url: "https://geoportaal.maaamet.ee/est/Ruumiandmed/Geoloogilised-andmed-p115.html",
  },
  { name: "doi.title", url: "https://doi.geocollections.info" },
  { name: "turba.title", url: "https://turba.geoloogia.info" },
  { name: "geocase.title", url: "https://geocase.eu" },
  { name: "eurocore.title", url: "eurocore.description" },
  { name: "sarv.title", url: "https://edit.geocollections.info" },
  { name: "link.geologyAPI", url: "https://api.geoloogia.info" },
];

const searchRoutes = [
  {
    routeName: "locality",
    text: "locality.pageTitle",
  },
  {
    routeName: "site",
    text: "site.pageTitle",
  },
  {
    routeName: "drillcore",
    text: "drillcore.pageTitle",
  },
  {
    routeName: "sample",
    text: "sample.pageTitle",
  },
  {
    routeName: "analysis",
    text: "analysis.pageTitle",
  },
  {
    routeName: "analytical-data",
    text: "analyticalData.pageTitle",
  },
  {
    routeName: "dataset",
    text: "dataset.pageTitle",
  },
  {
    routeName: "taxon",
    text: "taxon.pageTitle",
  },
  {
    routeName: "stratigraphy",
    text: "stratigraphy.pageTitle",
  },
  {
    routeName: "photo",
    text: "photo.pageTitle",
  },
  {
    routeName: "specimen",
    text: "specimen.pageTitle",
  },
  { routeName: "preparation", text: "preparation.pageTitle" },
  { routeName: "area", text: "area.pageTitle" },
];
const routes = [
  {
    routeName: "search",
    text: "common.search",
  },
  {
    routeName: "about",
    text: "common.about",
  },
  {
    routeName: "news",
    text: "common.news",
  },
];
</script>

<template>
  <div class="bg-grey-lighten-5 border-t">
    <VContainer>
      <VRow no-gutters>
        <VCol cols="12" lg="auto">
          <div class="d-md-flex justify-center">
            <div class="ml-4 ml-md-0 mr-4 mb-6">
              <NuxtImg
                :src="logo"
                height="24"
                width="60"
                format="webp"
                style="margin-bottom: 10px"
                :alt="$t('logo.alt')"
              />
              <div
                v-for="link in routes"
                :key="link.routeName"
                class="d-flex mb-2"
              >
                <VIcon
                  class="align-self-center"
                  :icon="mdiChevronRight"
                  size="x-small"
                />
                <NuxtLink
                  :to="localePath(link.routeName)"
                  class="text-body-2 text-decoration-none text-grey-darken-3 d-block ml-1"
                  style="font-weight: 500 !important"
                >
                  {{ $t(link.text) }}
                </NuxtLink>
              </div>
            </div>
            <div class="mx-4 mb-6">
              <div
                class="section-title font-weight-medium montserrat mb-4"
              >
                {{ $t("landing.searchRoutes") }}
              </div>

              <div class="d-sm-inline-block" style="column-count: 2">
                <div
                  v-for="link in searchRoutes"
                  :key="link.routeName"
                  class="d-flex mb-2"
                >
                  <VIcon
                    class="align-self-center"
                    :icon="mdiChevronRight"
                    size="x-small"
                  />
                  <NuxtLink
                    :to="localePath(link.routeName)"
                    class="text-body-2 text-decoration-none text-grey-darken-3 d-block ml-1"
                    style="font-weight: 500 !important"
                  >
                    {{ $t(link.text) }}
                  </NuxtLink>
                </div>
              </div>
            </div>
            <div class="ml-3 mb-6">
              <div
                class="section-title font-weight-medium montserrat mb-4"
              >
                {{ $t("common.links") }}
              </div>

              <div class="d-sm-inline-block" style="column-count: 2">
                <div
                  v-for="link in links"
                  :key="link.name"
                  class="d-flex mb-2"
                >
                  <VIcon
                    class="align-self-center"
                    :icon="mdiChevronRight"
                    size="x-small"
                  />
                  <a
                    :href="link.url"
                    class="text-body-2 text-decoration-none text-grey-darken-3 d-block ml-1"
                    style="font-weight: 500 !important"
                  >
                    {{ $t(link.name) }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </VCol>
        <VCol>
          <div class="ml-3 mb-6">
            <div
              class="section-title font-weight-medium montserrat mb-4"
            >
              {{ $t("common.partners") }}
            </div>
            <div>
              <a
                v-for="(item, index) in imageLinks"
                :key="index"
                :href="item.href"
                target="FooterLink"
                rel="noopener noreferrer"
              >
                <VTooltip location="top" :aria-label="item.title">
                  <template #activator="{ props }">
                    <NuxtImg
                      v-bind="props"
                      :src="item.src"
                      :alt="$t(item.alt)"
                      :height="item.height"
                      :width="item.width"
                      class="footer-logo py-1 py-sm-0 px-3"
                    />
                  </template>

                  <span>{{ $t(item.title) }}</span>
                </VTooltip>
              </a>
            </div>
          </div>
        </VCol>
      </VRow>
    </VContainer>
    <VContainer fluid class="border-t">
      <VRow class="pb-2">
        <VCol class="text-body-2 text-center">
          <div class="text-center d-flex justify-center align-center">
            <div style="max-width: 700px">
              <I18nT
                class="text-body-2 "
                keypath="privacyNotice"
                scope="global"
                tag="div"
              >
                <a
                  href="https://matomo.org"
                  class="font-weight-bold text-blue-darken-3 text-decoration-none"
                >Matomo</a>
              </I18nT>
            </div>
          </div>
        </VCol>
      </VRow>
      <VRow no-gutters>
        <VCol cols="12" align-self="center">
          <div class="text-center d-flex justify-center align-center">
            <div style="max-width: 700px">
              <I18nT
                class="text-body-2 "
                keypath="footer"
                scope="global"
                tag="div"
              >
                <a
                  v-for="(item, index) in textLinks"
                  :key="index"
                  :href="item.href"
                  class="font-weight-bold text-blue-darken-3 text-decoration-none"
                >
                  {{ item.text }}
                </a>
              </I18nT>
            </div>
          </div>
        </VCol>
        <VCol
          cols="12"
          align-self="center"
          class="text-center mt-3"
        >
          <a href="https://github.com/geocollections/eMaapou">
            <NuxtImg
              src="/logos/github-mark.png"
              alt="GitHub"
              format="webp"
              class="github-logo py-1 py-sm-0 px-3"
              width="32"
              height="32"
            />
          </a>
        </VCol>
      </VRow>
    </VContainer>
  </div>
</template>

<style scoped lang="scss">
.footer {
  -webkit-box-shadow: 0 -2px 4px -1px rgba(0, 0, 0, 0.2),
    0 -4px 5px 0 rgba(0, 0, 0, 0.14), 0 -1px 10px 0 rgba(0, 0, 0, 0.12) !important;
  box-shadow: 0 -2px 4px -1px rgba(0, 0, 0, 0.2),
    0 -4px 5px 0 rgba(0, 0, 0, 0.14), 0 -1px 10px 0 rgba(0, 0, 0, 0.12) !important;
}

.v-card__text {
  font-size: 0.7em;
  font-weight: 400;
  color: white !important;
}

/* .v-card__text a:visited,
.v-card__text a:link,
.v-card__text a:active {
  color: white !important;
  font-weight: 600;
} */

.footer-logo {
  // height: 60px;
  width: auto;
  /*padding: 0 10px;*/
}

.github-logo {
  height: 32px;
  width: auto;
  /*padding: 0 10px;*/
}

.hall {
  background-color: #5c6598 !important;
  border-color: #5c6598 !important;
}
</style>
