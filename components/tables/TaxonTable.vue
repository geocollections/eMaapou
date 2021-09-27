<template>
  <table-wrapper
    v-bind="$attrs"
    :headers="$_headers"
    :items="items"
    :options="options"
    :count="count"
    v-on="$listeners"
    @change:headers="$_handleHeadersChange"
    @reset:headers="$_handleHeadersReset"
  >
    <template #item.taxon="{ item }">
      <external-link
        v-if="item.id"
        @click.native="$openWindow(`https://fossiilid.info/${item.id}`)"
      >
        {{ `${item.taxon} ${item.author_year ? item.author_year : ''}` }}
      </external-link>
    </template>

    <template #item.fossil_group="{ item }">
      <external-link
        v-if="item.fossil_group_id"
        @click.native="
          $openWindow(`https://fossiilid.info/${item.fossil_group_id}`)
        "
      >
        {{ item.fossil_group }}
      </external-link>
      <div v-else>{{ item.fossil_group }}</div>
    </template>

    <template #item.parent_taxon="{ item }">
      <external-link
        v-if="item.parent_id"
        @click.native="$openWindow(`https://fossiilid.info/${item.parent_id}`)"
      >
        {{ item.parent_taxon }}
      </external-link>
      <div v-else>{{ item.parent_taxon }}</div>
    </template>

    <template #item.locality="{ item }">
      <nuxt-link
        v-if="item.locality_id"
        class="text-link"
        :to="
          localePath({ name: 'locality-id', params: { id: item.locality_id } })
        "
      >
        {{ $translate({ et: item.locality, en: item.locality_en }) }}
      </nuxt-link>
    </template>

    <template #item.fad="{ item }">
      <nuxt-link
        v-if="item.fad_id"
        class="text-link"
        :to="
          localePath({ name: 'stratigraphy-id', params: { id: item.fad_id } })
        "
      >
        {{ $translate({ et: item.fad, en: item.fad_en }) }}
      </nuxt-link>
    </template>
    <template #item.lad="{ item }">
      <nuxt-link
        v-if="item.lad_id"
        class="text-link"
        :to="
          localePath({ name: 'stratigraphy-id', params: { id: item.lad_id } })
        "
      >
        {{ $translate({ et: item.lad, en: item.lad_en }) }}
      </nuxt-link>
    </template>
  </table-wrapper>
</template>

<script>
import { mapState } from 'vuex'
import { round, cloneDeep } from 'lodash'
import TableWrapper from '~/components/tables/TableWrapper.vue'
import ExternalLink from '~/components/ExternalLink'
import headersMixin from '~/mixins/headersMixin'
import { HEADERS_TAXON } from '~/constants'
export default {
  name: 'TaxonTable',
  components: { ExternalLink, TableWrapper },
  mixins: [headersMixin],
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    count: {
      type: Number,
      default: 0,
    },
    options: {
      type: Object,
      default: () => ({
        page: 1,
        itemsPerPage: 25,
        sortBy: [],
        sortDesc: [],
      }),
    },
  },
  data() {
    return {
      localHeaders: cloneDeep(HEADERS_TAXON),
      module: 'taxon',
    }
  },
  computed: {
    ...mapState('headers', { stateHeaders: 'taxon' }),
  },
  methods: {
    round,
  },
}
</script>
