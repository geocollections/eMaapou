<template>
  <detail-new>
    <template #title>
      <header-detail-new :title="pageTitle">
        <template #tabs>
          <DetailTabs :tabs="data?.tabs" />
        </template>
      </header-detail-new>
    </template>

    <NuxtPage v-bind="activeTabProps" />
  </detail-new>
</template>

<script setup lang="ts">
import type { Tab } from "~/composables/useTabs";

const { $geoloogiaFetch, $translate, $solrFetch } = useNuxtApp();
const { t } = useI18n();
const route = useRoute();
const localePath = useLocalePath();

const pageTitle = computed(
  () =>
    `${t("drillcoreBox.nr", {
      number: data.value?.drillcoreBox.number,
    })} - ${$translate({
      et: data.value?.drillcoreBox.drillcore?.drillcore,
      en: data.value?.drillcoreBox.drillcore?.drillcore_en,
    })}`,
);

const { hydrateTabs, filterHydratedTabs, getCurrentTabRouteProps } = useTabs();
const activeTabProps = computed(() => {
  return getCurrentTabRouteProps(data.value?.tabs ?? []);
});

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
      console.log(ctx);
      if (!ctx?.drillcoreBox.drillcore?.locality) return 0;
      if (!ctx?.drillcoreBox.depth_start || !ctx?.drillcoreBox.depth_end)
        return 0;
      console.log("here");
      const response = await $solrFetch("/sample", {
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
      if (!ctx?.drillcoreBox.drillcore?.locality) return 0;
      if (!ctx?.drillcoreBox.depth_start || !ctx?.drillcoreBox.depth_end)
        return 0;

      const response = await $solrFetch("/analysis", {
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
      if (!ctx?.drillcoreBox.drillcore?.locality) return 0;
      if (!ctx?.drillcoreBox.depth_start || !ctx?.drillcoreBox.depth_end)
        return 0;

      const response = await $solrFetch("/specimen", {
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

const { data, pending, error } = await useAsyncData(
  "drillcore-box",
  async () => {
    const drillcoreBox = await $geoloogiaFetch(
      `/drillcore_box/${route.params.id}/`,
      {
        query: {
          nest: 1,
        },
        onResponseError: (error) => {
          if (error.response?.status === 404) {
            throw createError({
              statusCode: 404,
              message: "Drillcore box not found",
            });
          }
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

    return {
      drillcoreBox,
      tabs: filterHydratedTabs(hydratedTabs, [
        "general",
        "sample",
        "analysis",
        "specimen",
      ]),
    };
  },
);

redirectInvalidTab({
  redirectRoute: localePath({
    name: "drillcore-box-id",
    params: { id: route.params.id },
  }),
  tabs: data.value?.tabs ?? [],
});

// export default defineComponent({
//   setup() {
//     useMeta(() => {
//       return {
//         title: `${pageTitle.value} | ${i18n.t('drillcoreBox.pageTitle')}`,
//         meta: [
//           {
//             property: 'og:title',
//             hid: 'og:title',
//             content: `${pageTitle.value} | ${i18n.t('drillcoreBox.pageTitle')}`,
//           },
//           {
//             property: 'og:url',
//             hid: 'og:url',
//             content: route.value.path,
//           },
//           {
//             property: 'og:image',
//             hid: 'og:image',
//             content: $img(
//               `${state.activeImage?.attachment?.uuid_filename}`,
//               { size: 'medium' },
//               {
//                 provider: 'geocollections',
//               }
//             ),
//           },
//         ],
//       }
//     })
//     return { ...toRefs(state), drillcore, pageTitle, isNull, isNil }
//   },
//   head: {},
// })
</script>
