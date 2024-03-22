<script setup lang="ts">
import {
  mdiBug,
  mdiChartLine,
  mdiFileImageOutline,
  mdiImageFilterHdr,
  mdiMagnify,
  mdiMapMarker,
  mdiScrewMachineFlatTop,
} from "@mdi/js";
import { useDisplay } from "vuetify";

const img = useImage();
const backgroundImg = computed(() => {
  return img("/frontpage/header_img2.jpg");
});
const backgroundSvg = computed(() => {
  return img("/frontpage/layered-peaks-haikei.svg");
});

const { t } = useI18n();

definePageMeta({
  layout: "landing",
});

useHead({
  title: t("landing.title"),
  link: [
    {
      rel: "preload",
      as: "image",
      href: backgroundSvg.value,
    },
    {
      rel: "preload",
      as: "image",
      href: backgroundImg.value,
    },
  ],
});
const query = ref("");
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
  maardlad: {
    title: "maardlad.title",
    description: "maardlad.description",
    href: "https://geoportaal.maaamet.ee/est/Ruumiandmed/Geoloogilised-andmed-p115.html",
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
  ids: [
    "kirjandus",
    "fossiilid",
    "kivid",
    "fond",
    "maardlad",
    "stratigraphy",
    "gmre",
    "turba",
    "geocase",
    "eurocore",
    "geocollections",
    "doi",
    "sarv",
  ] as const,
});

interface SearchRoute {
  routeName: string;
  text: string;
  icon: string;
  count: number;
}
const { $solrFetch } = useNuxtApp();

interface NumFoundResponse {
  response: {
    numFound: number;
  };
}
const { data: searchRoutes } = await useAsyncData<SearchRoute[]>(
  "routes",
  async () => {
    const [
      specimenResponse,
      analysisResponse,
      sampleResponse,
      localityResponse,
      photoResponse,
      drillcoreResponse,
    ] = await Promise.all([
      $solrFetch<NumFoundResponse>("/specimen", {
        query: {
          q: "*:*",
          rows: 0,
        },
      }).catch<NumFoundResponse>((_) => {
        return { response: { numFound: 284000 } };
      }),
      $solrFetch<NumFoundResponse>("/analysis", {
        query: {
          q: "*:*",
          rows: 0,
        },
      }).catch<NumFoundResponse>((_) => {
        return { response: { numFound: 249000 } };
      }),
      $solrFetch<NumFoundResponse>("/sample", {
        query: {
          q: "*:*",
          rows: 0,
        },
      }).catch<NumFoundResponse>((_) => {
        return { response: { numFound: 156000 } };
      }),
      $solrFetch<NumFoundResponse>("/locality", {
        query: {
          q: "*:*",
          rows: 0,
        },
      }).catch<NumFoundResponse>((_) => {
        return { response: { numFound: 13000 } };
      }),
      $solrFetch<NumFoundResponse>("/attachment", {
        query: {
          q: "*:*",
          fq: "specimen_image_attachment:\"2\"",
          rows: 0,
        },
      }).catch<NumFoundResponse>((_) => {
        return { response: { numFound: 20000 } };
      }),
      $solrFetch<NumFoundResponse>("/drillcore", {
        query: {
          q: "*:*",
          rows: 0,
        },
      }).catch<NumFoundResponse>((_) => {
        return { response: { numFound: 500 } };
      }),
    ]);

    return [
      {
        routeName: "specimen",
        text: "specimen.landingCard",
        icon: mdiBug,
        count: specimenResponse.response.numFound,
      },
      {
        routeName: "locality",
        text: "locality.landingCard",
        icon: mdiMapMarker,
        count: localityResponse.response.numFound,
      },
      {
        routeName: "sample",
        text: "sample.landingCard",
        icon: mdiImageFilterHdr,
        count: sampleResponse.response.numFound,
      },
      {
        routeName: "drillcore",
        text: "drillcore.landingCard",
        icon: mdiScrewMachineFlatTop,
        count: drillcoreResponse.response.numFound,
      },
      {
        routeName: "analytical-data",
        text: "analyticalData.landingCard",
        icon: mdiChartLine,
        count: analysisResponse.response.numFound,
      },
      {
        routeName: "photo",
        text: "photo.landingCard",
        icon: mdiFileImageOutline,
        count: photoResponse.response.numFound,
      },
    ];
  },
);

const backgroundImage = computed(() => {
  return `url(${backgroundSvg.value}), url(${backgroundImg.value})`;
});

const { smAndUp } = useDisplay();
const topHeight = computed(() => {
  if (smAndUp)
    return "675px";
  return "650px";
});

const router = useRouter();
const localePath = useLocalePath();

function handleSearch() {
  router.push(localePath({ name: "search", query: { q: query.value } }));
}
</script>

<template>
  <div>
    <div
      class="spacer pt-16"
      :style="{
        'background-image': backgroundImage,
        'background-color': '#333333',
        'height': topHeight,
      }"
    >
      <VContainer
        :fluid="$vuetify.display.smAndDown"
        style="max-width: 1185px !important"
      >
        <VRow class="mb-lg-5">
          <VCol>
            <div class="pt-sm-4 pt-md-8" :style="{ 'max-width': '1000px' }">
              <I18nT
                keypath="title"
                tag="div"
                scope="global"
                class="text-h3 text-sm-h2 text-md-h1 text-white font-weight-bold"
              />
              <span
                class="text-h5 text-sm-h4 text-md-h3 font-weight-light text-white"
              >
                {{ $t("subtitle") }}
              </span>
            </div>
          </VCol>
        </VRow>
        <VRow>
          <VCol cols="12" md="5">
            <VCard
              class=""
              rounded="0"
              flat
              color="transparent"
            >
              <VCardActions class="px-0 pt-md-6">
                <VForm
                  class="d-flex text-right"
                  style="width: 100%"
                  @submit.prevent="handleSearch"
                >
                  <InputSearch
                    v-model="query"
                    :rounded="5"
                    input-class="elevation-1 border-none"
                    :placeholder="$t('landing.searchPlaceholder')"
                  />
                  <VBtn
                    height="49px"
                    width="84px"
                    class="text-body-1 ml-2 ml-sm-3 mt-0 mt-sm-0"
                    type="submit"
                    variant="elevated"
                    color="warning"
                  >
                    <VIcon :icon="mdiMagnify" size="large" />
                  </VBtn>
                </VForm>
              </VCardActions>
              <VCardText
                v-show="$vuetify.display.mdAndUp"
                style="word-break: break-word"
                :class="{
                  'font-small montserrat': $vuetify.display.smAndDown,
                }"
                class="text-sm-h6 font-weight-regular text-white pr-0 pl-1"
              >
                {{ $t("landing.description") }}
              </VCardText>
            </VCard>
          </VCol>
          <VCol
            cols="12"
            md="7"
            class="pl-lg-10"
          >
            <VCard color="transparent" flat>
              <VRow no-gutters justify="center">
                <div class="col-12 col-xl-auto d-flex flex-wrap">
                  <VCol
                    v-for="(route, index) in searchRoutes"
                    :key="`${route.routeName}-${index}`"
                    cols="12"
                    class="pa-0"
                    sm="6"
                    md="6"
                    lg="6"
                  >
                    <CardRouteLink :route="route" />
                  </VCol>
                </div>
              </VRow>
            </VCard>
          </VCol>
        </VRow>
      </VContainer>
    </div>
    <VContainer
      :fluid="$vuetify.display.smAndDown"
      style="max-width: 1185px !important"
    >
      <VRow justify="center" class="mt-4">
        <VCol
          cols="12"
          md="8"
          class="pr-5"
          order="1"
          order-md="0"
        >
          <TheNewsCard />
        </VCol>
        <VCol
          cols="12"
          md="4"
          class="pl-lg-5"
          order="0"
          order-md="0"
        >
          <BaseHeader class="pb-2" :title="$t('landing.otherServices')" />

          <VRow no-gutters>
            <VCol
              v-for="(route, index) in otherServices.ids.map(
                (id) => otherServices[id],
              )"
              :key="`external-card-${index}`"
              cols="12"
              lg="12"
              class="pb-2 px-1"
            >
              <CardExternalService :route="route" />
            </VCol>
          </VRow>
        </VCol>
      </VRow>
    </VContainer>
  </div>
</template>

<style lang="scss" scoped>
@import "vuetify/settings";

.spacer {
  aspect-ratio: 900/600;
  width: 100%;
  background-repeat: no-repeat;
  background-position: bottom, center;
  background-size: cover, cover;

  @media #{map-get($display-breakpoints, 'xl-and-up')} {
    background-position:
      bottom -5rem right,
      center;
  }
}
</style>
