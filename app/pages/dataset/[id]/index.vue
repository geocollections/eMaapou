<script setup lang="ts">
import type { Dataset } from "../[id].vue";
import isEmpty from "lodash/isEmpty";
import BaseLinkExternal from "~/components/base/BaseLinkExternal.vue";

defineProps<{ dataset: Dataset; parameters: any }>();

const { $solrFetch, $apiFetch, $translate } = useNuxtApp();
const route = useRoute();
const localePath = useLocalePath();

const { data } = await useAsyncData("datasetGeneral", async () => {
  const doiPromise = $apiFetch<GeoloogiaListResponse>("/dois/", {
    query: {
      dataset: route.params.id,
      expand: "reference",
      fields: "identifier,reference.id,reference.reference",
    },
  });
  const localityGroupedPromise = $solrFetch<any>("/analysis", {
    query: {
      "q": "*",
      "fq": `dataset_ids:${route.params.id}`,
      "fl": "locality_id,locality,locality_en,latitude,longitude,site_id,name,name_en",
      "group": true,
      "group.field": ["locality_id", "site_id"],
      "rows": 10000,
    },
  });
  const [doiResponse, localityGroupedResponse]
    = await Promise.all([doiPromise, localityGroupedPromise]);

  const doi = doiResponse.results?.[0]?.identifier;
  const reference = doiResponse.results?.[0]?.reference
    ? {
        id: doiResponse.results[0].reference.id,
        reference: doiResponse.results[0].reference.reference,
      }
    : undefined;

  const localities = localityGroupedResponse?.grouped?.locality_id?.groups
    ?.map((item: any) => item?.doclist?.docs?.[0])
    .filter((item: any) => {
      return !isEmpty(item) && item?.locality_id;
    });
  const sites = localityGroupedResponse?.grouped?.site_id?.groups
    ?.map((item: any) => item?.doclist?.docs?.[0])
    .filter((item: any) => {
      return !isEmpty(item) && item?.site_id;
    });
  const locationMarkers = localities
    .concat(sites)
    .reduce((filtered: any[], item: any): MapMarker[] => {
      if (!(item.latitude && item.longitude))
        return filtered;
      const isItemInArray = filtered.some(
        existingItem =>
          existingItem.latitude === item.latitude
          && existingItem.longitude === item.longitude,
      );
      if (isItemInArray)
        return filtered;

      const routeName = item.locality_id ? "locality-id" : "site-id";
      const routeId = item.locality_id ?? item.site_id;

      const newItem = {
        latitude: item.latitude,
        longitude: item.longitude,
        text:
          $translate({ et: item.locality, en: item.locality_en })
          ?? (item.name || `ID: ${item.id}`),
        route: localePath({ name: routeName, params: { id: routeId } }),
      } as MapMarker;

      return [...filtered, newItem];
    }, [] as MapMarker[]);
  return {
    doi,
    reference,
    locationMarkers,
    localities,
  };
});

const doi = computed(() => data.value?.doi);
const reference = computed(() => data.value?.reference);
const locationMarkers = computed(() => data.value?.locationMarkers ?? []);
</script>

<template>
  <VContainer style="margin: initial">
    <VRow>
      <VCol
        :sm="12"
        :md="6"
        :lg="7"
        :xl="5"
      >
        <BaseTable class="rounded border">
          <TableRow :title="$t('dataset.title')" :value="dataset.title" />
          <TableRow
            :title="$t('dataset.titleTranslated')"
            :value="dataset.title_translated"
          />
          <TableRow
            :title="$t('dataset.titleAlt')"
            :value="dataset.title_alternative"
          />
          <TableRow
            v-if="dataset.creators || dataset.owner_text || dataset.owner"
            :title="$t('dataset.creators')"
            :value="
              dataset.creators || dataset.owner_text || dataset.owner?.name
            "
          />
          <TableRow
            :title="$t('dataset.publicationYear')"
            :value="dataset.publication_year"
          />
          <TableRow :title="$t('dataset.date')" :value="dataset.date" />
          <TableRow
            :title="$t('dataset.resourceTopic')"
            :value="dataset.resource"
          />
          <TableRow
            :title="$t('dataset.publisher')"
            :value="dataset.publisher"
          />
          <TableRow
            :title="$t('dataset.subjects')"
            :value="dataset.subjects"
          />
          <TableRow
            v-if="dataset.language"
            :title="$t('dataset.language')"
            :value="
              $translate({
                et: dataset.language.name,
                en: dataset.language.name_en,
              })
            "
          />
          <TableRow
            :title="$t('dataset.abstract')"
            :value="dataset.abstract"
          />
          <TableRow
            :title="$t('dataset.methods')"
            :value="dataset.methods"
          />
          <TableRow
            :title="$t('dataset.version')"
            :value="dataset.version"
          />
          <TableRow
            v-if="doi"
            :title="$t('dataset.doi')"
            :value="doi"
          >
            <template #value="{ value }">
              <BaseLinkExternal
                :to="`https://doi.geocollections.info/${value}`"
              >
                {{
                  value
                }}
              </BaseLinkExternal>
            </template>
          </TableRow>
          <TableRow
            v-if="reference"
            :title="$t('dataset.reference')"
            :value="reference"
          >
            <template #value="{ value }">
              <BaseLinkExternal
                :to="`https://kirjandus.geoloogia.info/reference/${value.id}`"
              >
                {{
                  value.reference
                }}
              </BaseLinkExternal>
            </template>
          </TableRow>
          <TableRow
            v-if="dataset.locality"
            :title="$t('dataset.locality')"
            :value="dataset.locality"
          >
            <template #value="{ value }">
              <BaseLink
                :to="
                  localePath({
                    name: 'locality-id',
                    params: { id: value.id },
                  })
                "
              >
                {{
                  $translate({
                    et: value.name,
                    en: value.name_en,
                  })
                }}
              </BaseLink>
            </template>
          </TableRow>
          <TableRow
            v-if="dataset.copyright_agent"
            :title="$t('dataset.copyright')"
            :value="dataset.copyright_agent.name"
          />
          <TableRow
            v-if="dataset.licence"
            :title="$t('dataset.licence')"
            :value="dataset.licence"
          >
            <template #value="{ value }">
              <BaseLinkExternal
                :to="value.url"
              >
                {{ value.name }}
              </BaseLinkExternal>
            </template>
          </TableRow>
          <TableRow
            v-if="dataset.date_added"
            :title="$t('dataset.dateAdded')"
            :value="$formatDate(dataset.date_added)"
          />
          <TableRow
            v-if="dataset.date_changed"
            :title="$t('dataset.dateChanged')"
            :value="$formatDate(dataset.date_changed)"
          />
          <TableRow
            v-if="parameters.length > 0"
            :title="$t('dataset.parameters')"
            :value="parameters"
          >
            <template #value>
              <VChip
                v-for="(parameter, i) in parameters"
                :key="i"
                size="small"
                class="mr-1 mb-1"
              >
                {{ parameter.title }}
              </VChip>
            </template>
          </TableRow>
        </BaseTable>
      </VCol>
      <VCol v-if="locationMarkers.length > 0">
        <MapDetail :markers="locationMarkers" />
      </VCol>
    </VRow>
  </VContainer>
</template>
