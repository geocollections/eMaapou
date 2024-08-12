<script setup lang="ts">
import { mdiEyedropper } from "@mdi/js";
import type { HydratedTab, Tab } from "~/composables/useTabs";

const { $geoloogiaFetch, $apiFetch } = useNuxtApp();
const route = useRoute();
const { t } = useI18n();
const localePath = useLocalePath();

const preparationsStore = usePreparations();
const { getQueryParams } = preparationsStore;
const { solrFilters, solrQuery, solrSort } = storeToRefs(preparationsStore);
const {
  data: preparationsRes,
  page,
  handleSelect,
  showDrawer,
} = await useSearchResultsDrawer("/preparation", {
  routeName: "preparation-id",
  solrParams: {
    query: solrQuery,
    filter: solrFilters,
    sort: solrSort,
  },
});
const similarPreparations = computed(
  () => preparationsRes.value?.response.docs ?? [],
);

const { hydrateTabs, filterHydratedTabs, getCurrentTabRouteProps } = useTabs();
const tabs = {
  general: {
    type: "static",
    routeName: "preparation-id",
    title: "common.general",
    props: {},
  } satisfies Tab,
  attachment: {
    type: "dynamic",
    routeName: "preparation-id-attachments",
    title: "preparation.attachments",
    count: async () => {
      const response = await $geoloogiaFetch<GeoloogiaListResponse>("/attachment_link/", {
        query: {
          preparation: route.params.id,
          limit: 0,
        },
      });

      return response.count;
    },
    props: {},
  } satisfies Tab,
  taxon: {
    type: "dynamic",
    routeName: "preparation-id-taxa",
    title: "preparation.taxa",
    count: async () => {
      const response = await $geoloogiaFetch<GeoloogiaListResponse>("/taxon_list/", {
        query: {
          preparation: route.params.id,
          limit: 0,
        },
      });
      return response.count;
    },
    props: {},
  } satisfies Tab,
};

export interface Preparation {
  id: number;
  number: string;
  sample_number: Nullable<string>;
  remarks: Nullable<string>;
  date_added: Nullable<string>;
  date_changed: Nullable<string>;
  location: Nullable<string>;
  identification_date: Nullable<string>;
  identification_remarks: Nullable<string>;
  agent_text: Nullable<string>;
  date_prepared: Nullable<string>;
  date_prepared_text: Nullable<string>;
  sample: Nullable<{
    id: number;
    number: string;
    number_additional: Nullable<string>;
    number_field: Nullable<string>;
    depth: Nullable<number>;
    depth_interval: Nullable<number>;
    date_collected: Nullable<string>;
    date_collected_text: Nullable<string>;
  }>;
  analysis: Nullable<{
    id: number;
  }>;
  taxon: Nullable<{
    id: number;
    name: string;
  }>;
  identification_agent: Nullable<{
    name: string;
  }>;
  agent: Nullable<{
    name: string;
  }>;
  storage: Nullable<{
    name: string;
  }>;
  owner: Nullable<{
    name: string;
  }>;
}

const { data } = await useAsyncData("preparation", async () => {
  const preparation = await $apiFetch<Preparation>(`/preparations/${route.params.id}/`, {
    query: {
      expand: "sample,analysis,taxon,identification_agent,agent,storage,owner",
      fields: [
        "id",
        "number",
        "sample_number",
        "sample.id",
        "sample.number",
        "sample.number_additional",
        "sample.number_field",
        "sample.depth",
        "sample.depth_interval",
        "sample.date_collected",
        "sample.date_collected_text",
        "remarks",
        "date_added",
        "date_changed",
        "location",
        "identification_date",
        "identification_remarks",
        "agent_text",
        "date_prepared",
        "date_prepared_text",
        "analysis.id",
        "taxon.id",
        "taxon.name",
        "identification_agent.name",
        "agent.name",
        "storage.name",
        "owner.name",
      ],
    },
    onResponseError: (_error) => {
      showError({
        statusCode: 404,
        message: t("error.notFound"),
      });
    },
  });

  const hydratedTabs = await hydrateTabs(tabs, {
    props: { general: { preparation } },
  });

  return {
    preparation,
    tabs: filterHydratedTabs(hydratedTabs, ["general", "attachment", "taxon"]),
  };
}, {
  default: () => ({
    preparation: null,
    tabs: [] as HydratedTab[],
  }),
});

const activeTabProps = computed(() => {
  return getCurrentTabRouteProps(data.value.tabs);
});

const title = computed(() => data.value.preparation?.number);

redirectInvalidTab({
  redirectRoute: localePath({
    name: "preparation-id",
    params: { id: route.params.id },
  }),
  tabs: data.value.tabs,
});

useHead({
  title: `${title.value} | ${t("preparation.pageTitle")}`,
});
</script>

<template>
  <TemplateDetail :show-similar="showDrawer">
    <template #title>
      <HeaderDetail :title="title">
        <template #prepend>
          <CategoryChip
            :title="$t('common.preparation')"
            :to="localePath({ path: '/preparation', query: getQueryParams() })"
            :icon="mdiEyedropper"
          />
        </template>
        <template #tabs>
          <DetailTabs :tabs="data?.tabs" />
        </template>
      </HeaderDetail>
    </template>
    <template #drawer>
      <SearchResultsDrawer
        :page="page"
        :results="similarPreparations"
        :total-results="preparationsRes?.response.numFound ?? 0"
        :search-route="localePath({ path: '/preparation', query: getQueryParams() })
        "
        :get-result-route="(item) =>
          localePath({ name: 'preparation-id', params: { id: item.id } })
        "
        @page:next="page++"
        @page:previous="page--"
        @select="handleSelect"
      >
        <template #itemTitle="{ item: preparation }">
          <div class="font-weight-medium">
            {{ preparation.preparation_number ?? preparation.id }}
          </div>
        </template>
      </SearchResultsDrawer>
    </template>
    <NuxtPage v-bind="activeTabProps" />
  </TemplateDetail>
</template>
