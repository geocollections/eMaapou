<template>
  <stack
    v-if="!$fetchState.pending"
    :column-min-width="400"
    :gutter-width="15"
    :gutter-height="15"
    class="mt-2"
  >
    <stack-item v-for="(card, index) in cards" :key="`related-${index}`">
      <v-card>
        <v-card-title class="montserrat py-2"
          >{{ $t(card.title) }}
        </v-card-title>

        <v-simple-table dense class="pb-3">
          <template #default>
            <tbody>
              <tr v-for="(row, key) in card.items" :key="key">
                <td>
                  <template v-if="card.isLink">
                    <a
                      class="text-link"
                      @click="
                        $openWindow(
                          `${card.href}${
                            card.id === 'doi'
                              ? row.doi.identifier
                              : row[card.id].id
                          }`
                        )
                      "
                    >
                      {{ buildData(card, row) }}
                      <v-icon small color="primary darken-2">
                        {{ icons.mdiOpenInNew }}
                      </v-icon>
                    </a>
                  </template>
                  <template v-else-if="card.isNuxtLink">
                    <nuxt-link
                      class="text-link"
                      :to="
                        localePath({
                          name: `${card.route ? card.route : card.id}-id`,
                          params: { id: row[card.id].id },
                        })
                      "
                    >
                      {{ buildData(card, row) }}
                    </nuxt-link>
                  </template>
                  <template v-else>
                    {{ buildData(card, row) }}
                  </template>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card>
    </stack-item>
  </stack>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from 'vue'
import { mdiOpenInNew } from '@mdi/js'
import { useContext, useFetch, useRoute } from '@nuxtjs/composition-api'
const relatedCards = [
  {
    id: 'collection',
    title: 'related.collection',
    count: 0,
    items: [],
    field: {
      et: 'collection_name',
      en: 'collection_name_en',
    },
  },
  {
    id: 'specimen',
    title: 'related.specimen',
    count: 0,
    items: [],
    isNuxtLink: true,
    field: {
      et: 'number',
      en: 'number',
    },
  },
  {
    id: 'sample',
    title: 'related.sample',
    count: 0,
    items: [],
    isNuxtLink: true,
    field: {
      et: 'number',
      en: 'number',
    },
  },
  {
    id: 'sample_series',
    title: 'related.sample_series',
    count: 0,
    items: [],
    field: {
      et: 'name',
      en: 'name',
    },
  },
  {
    id: 'analysis',
    title: 'related.analysis',
    count: 0,
    items: [],
    isNuxtLink: true,
    field: {
      et: 'number',
      en: 'number',
    },
  },
  {
    id: 'dataset',
    title: 'related.dataset',
    count: 0,
    items: [],
    isNuxtLink: true,
    field: {
      et: 'name',
      en: 'name_en',
    },
  },
  {
    id: 'doi',
    title: 'related.doi',
    count: 0,
    items: [],
    isLink: true,
    href: 'https://doi.geocollections.info/',
    field: {
      et: 'identifier',
      en: 'identifier',
    },
  },
  {
    id: 'locality',
    title: 'related.locality',
    count: 0,
    items: [],
    isNuxtLink: true,
    field: {
      et: 'locality',
      en: 'locality_en',
    },
  },
  {
    id: 'drillcore',
    title: 'related.drillcore',
    count: 0,
    items: [],
    isNuxtLink: true,
    field: {
      et: 'drillcore',
      en: 'drillcore_en',
    },
  },

  {
    id: 'drillcore_box',
    route: 'drillcore-box',
    title: 'related.drillcore_box',
    count: 0,
    items: [],
    isNuxtLink: true,
    field: {
      et: 'number',
      en: 'number',
    },
  },
  {
    id: 'preparation',
    title: 'related.preparation',
    count: 0,
    items: [],
    isNuxtLink: true,
    field: {
      et: 'preparation_number',
      en: 'preparation_number',
    },
  },
  {
    id: 'reference',
    title: 'related.reference',
    count: 0,
    items: [],
    isLink: true,
    href: 'https://kirjandus.geoloogia.info/reference/',
    field: {
      et: 'reference',
      en: 'reference',
    },
  },
  {
    id: 'storage',
    title: 'related.storage',
    count: 0,
    items: [],
    field: {
      et: 'location',
      en: 'location',
    },
  },
  {
    id: 'project',
    title: 'related.project',
    count: 0,
    items: [],
    field: {
      et: 'name',
      en: 'name_en',
    },
  },
  {
    id: 'site',
    title: 'related.site',
    count: 0,
    items: [],
    isNuxtLink: true,
    field: {
      et: 'name',
      en: 'name_en',
    },
  },
  {
    id: 'locality_description',
    title: 'related.locality_description',
    count: 0,
    items: [],
    field: {
      et: 'description',
      en: 'description',
    },
  },
  {
    id: 'taxon',
    title: 'related.taxon',
    count: 0,
    items: [],
    isLink: true,
    href: 'https://fossiilid.info/',
    field: {
      et: 'taxon',
      en: 'taxon',
    },
  },
]
export default defineComponent({
  name: 'FileDetailRelations',
  fetchOnServer: false,
  setup() {
    const { $translate, $services } = useContext()
    const state = reactive({
      cards: [] as any[],
    })
    const icons = computed(() => ({ mdiOpenInNew }))
    const route = useRoute()
    useFetch(async () => {
      const hydratedTabs = await Promise.all(
        relatedCards.map(async (tab) => {
          const res = await $services.sarvREST.getResourceList(
            'attachment_link',
            {
              defaultParams: {
                [`${tab.id}__isnull`]: false,
                attachment: route.value.params.id,
                nest: ['specimen', 'analysis'].includes(tab.id) ? 2 : 1,
              },
            }
          )
          return { ...tab, count: res.count, items: res.items }
        })
      )
      state.cards = hydratedTabs.filter((item) => item.count > 0)
    })
    const buildData = (
      tab: { id: string; field: { et: string; en: string } },
      data: any
    ) => {
      if (tab.id === 'specimen') {
        return `${data[tab.id].coll.number.split(' ')[0]} ${
          data[tab.id].specimen_id
        }`
      }
      if (tab.id === 'analysis') {
        return data[tab.id].sample.number
      } else {
        return $translate({
          et: data[tab.id][tab.field.et],
          en: data[tab.id][tab.field.en],
        })
      }
    }
    return { ...toRefs(state), icons, buildData }
  },
})
</script>
