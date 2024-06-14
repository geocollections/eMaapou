<script setup lang="ts">
import { mdiMagnify } from "@mdi/js";
import orderBy from "lodash/orderBy";
import type { Tab } from "~/composables/useTabs";

const { $solrFetch } = useNuxtApp();

const route = useRoute();
const { hydrateTabs } = useTabs();

async function getTabCount(request: string) {
  const res = await $solrFetch<SolrResponse>(request, {
    query: {
      q: route.query?.q ?? "*",
      rows: 0,
    },
  });
  return res.response.numFound;
}

const tabs = {
  locality: {
    type: "dynamic",
    routeName: "search-localities",
    title: "landing.localities",
    count: async (_ctx) => {
      return await getTabCount("/locality");
    },
    props: {},
  } satisfies Tab,
  site: {
    type: "dynamic",
    routeName: "search-sites",
    title: "landing.sites",
    count: async (_ctx) => {
      return await getTabCount("/site");
    },
    props: {},
  } satisfies Tab,
  drillcore: {
    type: "dynamic",
    routeName: "search-drillcores",
    title: "landing.drillcores",
    count: async (_ctx) => {
      return await getTabCount("/drillcore");
    },
    props: {},
  } satisfies Tab,
  sample: {
    type: "dynamic",
    routeName: "search-samples",
    title: "landing.samples",
    count: async (_ctx) => {
      return await getTabCount("/sample");
    },
    props: {},
  } satisfies Tab,
  analysis: {
    type: "dynamic",
    routeName: "search-analyses",
    title: "landing.analyses",
    count: async (_ctx) => {
      return await getTabCount("/analysis");
    },
    props: {},
  } satisfies Tab,
  preparation: {
    type: "dynamic",
    routeName: "search-preparations",
    title: "landing.preparations",
    count: async (_ctx) => {
      return await getTabCount("/preparation");
    },
    props: {},
  } satisfies Tab,
  reference: {
    type: "dynamic",
    routeName: "search-references",
    title: "landing.references",
    count: async (_ctx) => {
      return await getTabCount("/reference");
    },
    props: {},
  } satisfies Tab,
  specimen: {
    type: "dynamic",
    routeName: "search-specimens",
    title: "landing.specimens",
    count: async (_ctx) => {
      return await getTabCount("/specimen");
    },
    props: {},
  } satisfies Tab,
  doi: {
    type: "dynamic",
    routeName: "search-dois",
    title: "landing.dois",
    count: async (_ctx) => {
      return await getTabCount("/doi");
    },
    props: {},
  } satisfies Tab,
  dataset: {
    type: "dynamic",
    routeName: "search-datasets",
    title: "landing.datasets",
    count: async (_ctx) => {
      return await getTabCount("/dataset");
    },
    props: {},
  } satisfies Tab,
  attachment: {
    type: "dynamic",
    routeName: "search-files",
    title: "landing.attachments",
    count: async (_ctx) => {
      return await getTabCount("/attachment");
    },
    props: {},
  } satisfies Tab,
  photo: {
    type: "dynamic",
    routeName: "search-photos",
    title: "landing.photos",
    count: async (_ctx) => {
      const res = await $solrFetch<SolrResponse>("/attachment", {
        query: {
          q: route.query?.q ?? "*",
          rows: 0,
          fq: "specimen_image_attachment:2",
        },
      });
      return res.response.numFound;
    },
    props: {},
  } satisfies Tab,
  taxon: {
    type: "dynamic",
    routeName: "search-taxa",
    title: "landing.taxa",
    count: async (_ctx) => {
      return await getTabCount("/taxon");
    },
    props: {},
  } satisfies Tab,
  rock: {
    type: "dynamic",
    routeName: "search-rocks",
    title: "landing.rocks",
    count: async (_ctx) => {
      return await getTabCount("/rock");
    },
    props: {},
  } satisfies Tab,
  stratigraphy: {
    type: "dynamic",
    routeName: "search-stratigraphy",
    title: "landing.stratigraphy",
    count: async (_ctx) => {
      return await getTabCount("/stratigraphy");
    },
    props: {},
  } satisfies Tab,
  area: {
    type: "dynamic",
    routeName: "search-areas",
    title: "landing.areas",
    count: async (_ctx) => {
      return await getTabCount("/area");
    },
    props: {},
  } satisfies Tab,
};
const noResults = ref(false);

const { data, refresh: fetch } = await useAsyncData("quickSearch", async () => {
  const hydratedTabs = await hydrateTabs(tabs, {
    props: {
    },
    ctx: { },
  });
  const orderedTabs = orderBy(hydratedTabs, ["count"], ["desc"]);

  if (orderedTabs[0] !== undefined && orderedTabs[0].count > 0)
    noResults.value = false;

  return {
    tabs: orderedTabs,
  };
}, { default: () => ({ tabs: [] }) });

const localeRoute = useLocaleRoute();
const router = useRouter();
const getRouteBaseName = useRouteBaseName();

watch(() => route.name, () => {
  redirectToValidRoute(data.value.tabs);
}, { immediate: true });

function redirectToValidRoute(tabs: any[]) {
  if (getRouteBaseName(route) === "search") {
    if (tabs[0].count < 1) {
      noResults.value = true;
      return;
    }

    const validRoute = localeRoute({ name: tabs[0].routeName, query: route.query });
    if (!validRoute)
      return;

    router.replace(validRoute);
  }
}

watch(
  () => route.query.q,
  () => {
    fetch();
  },
);

const query = computed(() => {
  if (!route.query.q)
    return "*";
  if (route.query.q.length < 1)
    return "*";

  return route.query.q;
});

const { t } = useI18n();
useHead({
  title: t("search.pageTitle"),
});
</script>

<template>
  <VMain>
    <VContainer
      class="pt-1 pb-10 px-0"
      style="height: 100%"
      :fluid="true"
    >
      <div>
        <VRow
          no-gutters
          justify="center"
          align="center"
        >
          <VCol class="my-4 mx-2">
            <BaseHeader :icon="mdiMagnify">
              <template #title>
                <I18nT keypath="quickSearch.title" tag="div">
                  <template #query>
                    <b v-text="route.query.q" />
                  </template>
                </I18nT>
              </template>
            </BaseHeader>
          </VCol>
        </VRow>
        <VRow no-gutters>
          <VCol class="mx-4">
            <ButtonTabs :tabs="data.tabs" />
          </VCol>
        </VRow>
        <div v-if="noResults">
          <div class="mt-4 text-h4 text-center">
            {{ $t("quickSearch.noResults") }}
          </div>
        </div>
        <NuxtPage
          class="border-t border-b"
          :query="query"
          keep-alive
        />
      </div>
    </VContainer>
  </VMain>
</template>
