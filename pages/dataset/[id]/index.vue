<script setup lang="ts">
import isEmpty from "lodash/isEmpty";

const props = defineProps<{ dataset: any; parameters: any }>();
const { $solrFetch, $geoloogiaFetch } = useNuxtApp();
const route = useRoute();
const localePath = useLocalePath();

const doi = computed(() => data.value?.doi);
const reference = computed(() => data.value?.reference);
const locationMarkers = computed(() => data.value?.locationMarkers ?? []);

const { data } = await useAsyncData("datasetGeneral", async () => {
  const parametersPromise = $solrFetch("/dataset", {
    query: {
      q: `id:${route.params.id}`,
      fl: "parameter_index_list,parameter_list",
    },
  });
  const doiPromise = $geoloogiaFetch("/doi/", {
    query: {
      dataset: route.params.id,
      nest: 1,
    },
  });
  const localityGroupedPromise = $solrFetch("/analysis", {
    query: {
      "q": "*",
      "fq": `dataset_ids:${route.params.id}`,
      "fl": "locality_id,locality,locality_en,latitude,longitude,site_id,name,name_en",
      "group": true,
      "group.field": ["locality_id", "site_id"],
      "rows": 10000,
    },
  });
  const [parametersResponse, doiResponse, localityGroupedResponse]
    = await Promise.all([parametersPromise, doiPromise, localityGroupedPromise]);

  const parameterValues
    = parametersResponse.response.docs[0]?.parameter_index_list?.[0]?.split("; ");
  const parameterText
    = parametersResponse.response.docs[0]?.parameter_list?.[0]?.split("; ");

  const parameters
    = parameterValues?.map((v: string, i: number) => {
      return { text: parameterText[i], value: v };
    }) ?? [];

  const parameterHeaders = {
    byIds: parameters.reduce((prev, parameter) => {
      return { ...prev, [parameter.value]: { ...parameter, show: false } };
    }, {}),
    allIds: parameterValues,
  };

  const doi = doiResponse.results?.[0]?.identifier;
  const reference = {
    id: doiResponse.results?.[0]?.reference?.id,
    reference: doiResponse.results?.[0]?.reference?.reference,
  };

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
    .reduce((filtered: MapMarker[], item): MapMarker[] => {
      if (!(item.latitude && item.longitude))
        return filtered;
      const isItemInArray = filtered.some(
        existingItem =>
          existingItem.latitude === item.latitude
          && existingItem.longitude === item.longitude,
      );
      if (isItemInArray)
        return filtered;

      const newItem = {
        latitude: item.latitude,
        longitude: item.longitude,
        text:
          $translate({ et: item.locality, en: item.locality_en })
          ?? (item.name || `ID: ${item.id}`),
        routeName: item.locality_id ? "locality" : "site",
        id: item.locality_id ?? item.site_id,
      };

      return [...filtered, newItem];
    }, []);
  return {
    parameters,
    parameterHeaders,
    doi,
    reference,
    locationMarkers,
    localities,
  };
});
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
        <VCard>
          <BaseTable>
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
              v-if="dataset.creators || dataset.owner_txt || dataset.owner"
              :title="$t('dataset.creators')"
              :value="
                dataset.creators || dataset.owner_txt || dataset.owner.agent
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
                  et: dataset.language.value,
                  en: dataset.language.value_en,
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
            <TableRowLink
              v-if="doi"
              :title="$t('dataset.doi')"
              :value="doi"
              :href="`https://doi.geocollections.info/${doi}`"
            />
            <TableRowLink
              v-if="reference"
              :title="$t('dataset.reference')"
              :value="reference.reference"
              :href="`https://kirjandus.geoloogia.info/reference/${reference.id}`"
            />
            <TableRowLink
              v-if="dataset.locality"
              :title="$t('dataset.locality')"
              :value="
                $translate({
                  et: dataset.locality.locality,
                  en: dataset.locality.locality_en,
                })
              "
              nuxt
              :href="
                localePath({
                  name: 'locality-id',
                  params: { id: dataset.locality.id },
                })
              "
            />
            <TableRow
              v-if="dataset.copyright_agent"
              :title="$t('dataset.copyright')"
              :value="dataset.copyright_agent.agent"
            />
            <TableRowLink
              v-if="dataset.licence"
              :title="$t('dataset.licence')"
              :value="
                $translate({
                  et: dataset.licence.licence,
                  en: dataset.licence.licence_en,
                })
              "
              :href="
                $translate({
                  et: dataset.licence.licence_url,
                  en: dataset.licence.licence_url_en,
                })
              "
            />
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
                  {{ parameter.text }}
                </VChip>
              </template>
            </TableRow>
          </BaseTable>
        </VCard>
      </VCol>
      <VCol v-if="locationMarkers.length > 0">
        <MapDetail rounded :markers="locationMarkers" />
      </VCol>
    </VRow>
  </VContainer>
</template>
