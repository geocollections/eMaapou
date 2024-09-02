<script setup lang="ts">
import { mdiArchive } from "@mdi/js";
import type { Tab } from "~/composables/useTabs";

const { $translate, $solrFetch, $apiFetch } = useNuxtApp();
const { t } = useI18n();
const route = useRoute();
const localePath = useLocalePath();

const { hydrateTabs, filterHydratedTabs, getCurrentTabRouteProps } = useTabs();

const tabs = {
  general: {
    type: "static",
    routeName: "drillcore-box-id",
    title: "common.general",
    props: {},
  } satisfies Tab,
  sample: {
    type: "dynamic",
    routeName: "drillcore-box-id-samples",
    title: "drillcore.samples",
    count: async (ctx) => {
      if (!ctx?.drillcoreBox.drillcore?.locality)
        return 0;
      if (!ctx?.drillcoreBox.depth_start || !ctx?.drillcoreBox.depth_end)
        return 0;
      const response = await $solrFetch<SolrResponse>("/sample", {
        query: {
          q: `locality_id:${ctx.drillcoreBox.drillcore.locality} AND (depth:[${ctx.drillcoreBox.depth_start} TO ${ctx.drillcoreBox.depth_end}] OR depth_interval:[${ctx.drillcoreBox.depth_start} TO ${ctx.drillcoreBox.depth_end}])`,
          rows: 0,
        },
      });

      return response.response.numFound;
    },
    props: {},
  } satisfies Tab,
  analysis: {
    type: "dynamic",
    routeName: "drillcore-box-id-analyses",
    title: "drillcore.analyses",
    count: async (ctx) => {
      if (!ctx?.drillcoreBox.drillcore?.locality)
        return 0;
      if (!ctx?.drillcoreBox.depth_start || !ctx?.drillcoreBox.depth_end)
        return 0;

      const response = await $solrFetch<SolrResponse>("/analysis", {
        query: {
          q: `locality_id:${ctx.drillcoreBox.drillcore.locality} AND (depth:[${ctx.drillcoreBox.depth_start} TO ${ctx.drillcoreBox.depth_end}] OR depth_interval:[${ctx.drillcoreBox.depth_start} TO ${ctx.drillcoreBox.depth_end}])`,
          rows: 0,
        },
      });

      return response.response.numFound;
    },
    props: {},
  } satisfies Tab,
  specimen: {
    type: "dynamic",
    routeName: "drillcore-box-id-specimens",
    title: "drillcore.specimens",
    count: async (ctx) => {
      if (!ctx?.drillcoreBox.drillcore?.locality)
        return 0;
      if (!ctx?.drillcoreBox.depth_start || !ctx?.drillcoreBox.depth_end)
        return 0;

      const response = await $solrFetch<SolrResponse>("/specimen", {
        query: {
          q: `locality_id:${ctx.drillcoreBox.drillcore.locality} AND (depth:[${ctx.drillcoreBox.depth_start} TO ${ctx.drillcoreBox.depth_end}] OR depth_interval:[${ctx.drillcoreBox.depth_start} TO ${ctx.drillcoreBox.depth_end}])`,
          rows: 0,
        },
      });

      return response.response.numFound;
    },
    props: {},
  } satisfies Tab,
};

export interface DrillcoreBox {
  id: number;
  number: string;
  depth_start: Nullable<number>;
  depth_end: Nullable<number>;
  depth_text: Nullable<string>;
  diameter: Nullable<number>;
  drillcore: {
    id: number;
    name: string;
    name_en: string;
    locality: number;
  };
  stratigraphy_top: Nullable<{
    id: number;
    name: string;
    name_en: string;
  }>;
  stratigraphy_top_text: Nullable<string>;
  stratigraphy_base: Nullable<{
    id: number;
    name: string;
    name_en: string;
  }>;
  stratigraphy_base_text: Nullable<string>;
  remarks: Nullable<string>;
  date_added: Nullable<string>;
  date_changed: Nullable<string>;
}

const { data } = await useAsyncData(
  "drillcore-box",
  async () => {
    const drillcoreBox = await $apiFetch<DrillcoreBox>(
      `/drillcore-boxes/${route.params.id}/`,
      {
        query: {
          expand: "drillcore,stratigraphy_top,stratigraphy_base",
          fields: [
            "id",
            "number",
            "depth_start",
            "depth_end",
            "depth_text",
            "diameter",
            "drillcore.id",
            "drillcore.name",
            "drillcore.name_en",
            "drillcore.locality",
            "stratigraphy_top",
            "stratigraphy_top.id",
            "stratigraphy_top.name",
            "stratigraphy_top.name_en",
            "stratigraphy_top_text",
            "stratigraphy_base",
            "stratigraphy_base.id",
            "stratigraphy_base.name",
            "stratigraphy_base.name_en",
            "stratigraphy_base_text",
            "remarks",
            "date_added",
            "date_changed",
          ].join(","),
        },
        onResponseError: (_error) => {
          showError({
            statusCode: 404,
            message: t("error.notFound"),
          });
        },
      },
    );

    const hydratedTabs = await hydrateTabs(tabs, {
      props: {
        general: { drillcoreBox },
        sample: {
          locality: drillcoreBox.drillcore.locality,
          depthStart: drillcoreBox.depth_start,
          depthEnd: drillcoreBox.depth_end,
        },
        analysis: {
          locality: drillcoreBox.drillcore.locality,
          depthStart: drillcoreBox.depth_start,
          depthEnd: drillcoreBox.depth_end,
        },
        specimen: {
          locality: drillcoreBox.drillcore.locality,
          depthStart: drillcoreBox.depth_start,
          depthEnd: drillcoreBox.depth_end,
        },
      },
      ctx: { drillcoreBox },
    });
    const attachmentLinks = await $apiFetch<GeoloogiaListResponse<{ uuid_filename: string }>>(`/drillcore-boxes/${route.params.id}/attachments/`, {
      query: {
        fields: "uuid_filename",
        ordering: "-is_preferred",
      },
    });

    const drillcoreBoxImages = attachmentLinks.results;
    const activeImage = drillcoreBoxImages[0];

    return {
      drillcoreBox,
      tabs: filterHydratedTabs(hydratedTabs, [
        "general",
        "sample",
        "analysis",
        "specimen",
      ]),
      activeImage,
    };
  },
  {
    default: () => ({
      drillcoreBox: null,
      tabs: [] as HydratedTab[],
      activeImage: null,
    }),
  },
);

const drillcoreBoxPositionStore = useDrillcoreBoxPosition();
const { page } = storeToRefs(drillcoreBoxPositionStore);

const { data: otherDrillcoreBoxesRes } = await useNewApiFetch<GeoloogiaListResponse>(`/drillcores/${data.value?.drillcoreBox?.drillcore.id}/drillcore-boxes/`, {
  query: computed(() => ({
    limit: 10,
    offset: getOffset(page.value, 10),
    fields: "id,number,image,depth_start,depth_end",
  })),
});

const otherDrillcoreBoxes = computed(() => otherDrillcoreBoxesRes?.value?.results ?? []);

const activeTabProps = computed(() => {
  return getCurrentTabRouteProps(data.value?.tabs ?? []);
});

const pageTitle = computed(
  () =>
    `${t("drillcoreBox.nr", {
      number: data.value?.drillcoreBox?.number,
    })} - ${$translate({
      et: data.value?.drillcoreBox?.drillcore?.name,
      en: data.value?.drillcoreBox?.drillcore?.name_en,
    })}`,
);

redirectInvalidTab({
  redirectRoute: localePath({
    name: "drillcore-box-id",
    params: { id: route.params.id },
  }),
  tabs: data.value?.tabs ?? [],
});

useHead({
  title: `${pageTitle.value} | ${t("drillcoreBox.pageTitle")}`,
});

const img = useImage();
useSeoMeta({
  ogImage: data.value?.activeImage
    ? img(
      data.value?.activeImage?.uuid_filename,
      { size: "medium" },
      {
        provider: "geocollections",
      },
    )
    : undefined,
});

function buildDepthString(depthStart: number, depthEnd: number) {
  const depthStartString = depthStart ? `${depthStart}` : "...";
  const depthEndString = depthEnd ? `${depthEnd}` : "...";
  return `${depthStartString} - ${depthEndString} (m)`;
}
</script>

<template>
  <TemplateDetail :show-similar="true">
    <template #title>
      <HeaderDetail :title="pageTitle">
        <template #prepend>
          <VChip
            class="text-none"
            variant="tonal"
            color="accent"
            label
          >
            <VIcon start>
              {{ mdiArchive }}
            </VIcon>
            {{ $t("common.drillcoreBox") }}
          </VChip>
        </template>
        <template #tabs>
          <DetailTabs :tabs="data?.tabs" />
        </template>
      </HeaderDetail>
    </template>
    <template #drawer>
      <SearchResultsDrawer
        :page="page"
        :results="otherDrillcoreBoxes"
        :total-results="otherDrillcoreBoxesRes?.count ?? 0"
        :search-route="
          localePath({ path: `/drillcore/${data.drillcoreBox?.drillcore.id}` })
        "
        :get-result-route="
          (item) =>
            localePath({ name: 'drillcore-box-id', params: { id: item.id } })
        "
        :show-check="false"
        @page:next="page++"
        @page:previous="page--"
      >
        <template #parentTitle>
          <span>
            {{
              $translate({
                et: data.drillcoreBox?.drillcore.name,
                en: data.drillcoreBox?.drillcore.name_en,
              })
            }}
          </span>
        </template>
        <template #itemTitle="{ item: box }">
          <span>
            {{
              $t("drillcoreBox.nr", {
                number: box.number,
              })
            }}
            <div>
              <NuxtImg
                v-if="box.image"
                :src="box.image"
                provider="geocollections"
                :modifiers="{ size: 'small' }"
                width="200"
                class="rounded"
              />
            </div>
          </span>
        </template>
        <template #itemSubtitle="{ item: box }">
          <span>
            {{ buildDepthString(box.depth_start, box.depth_end) }}
          </span>
        </template>
      </SearchResultsDrawer>
    </template>
    <template #mobileDrawerFabContent>
      <span>
        {{
          $translate({
            et: data.drillcoreBox?.drillcore.name,
            en: data.drillcoreBox?.drillcore.name_en,
          })
        }}
      </span>
    </template>
    <NuxtPage v-bind="activeTabProps" />
  </TemplateDetail>
</template>
