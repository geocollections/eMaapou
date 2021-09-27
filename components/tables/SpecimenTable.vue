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
    <template #item.id="{ item }">
      <nuxt-link
        v-if="item.id"
        class="text-link"
        :to="localePath({ name: 'specimen-id', params: { id: item.id } })"
      >
        {{ item.id }}
      </nuxt-link>
    </template>
    <template #item.specimen_full_name="{ item }">
      <nuxt-link
        v-if="item.specimen_full_name"
        class="text-link"
        :to="localePath({ name: 'specimen-id', params: { id: item.id } })"
      >
        {{ item.specimen_full_name }}
      </nuxt-link>
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
      <div v-else>
        {{ $translate({ et: item.locality, en: item.locality_en }) }}
      </div>
    </template>
    <template #item.kind="{ item }">
      {{
        $translate({
          et: item.specimen_kind,
          en: item.specimen_kind_en,
        })
      }}
    </template>
    <template #item.stratigraphy="{ item }">
      <nuxt-link
        v-if="item.stratigraphy_id"
        class="text-link"
        :to="
          localePath({
            name: 'stratigraphy-id',
            params: { id: item.stratigraphy_id },
          })
        "
      >
        {{
          $translate({
            et: item.stratigraphy,
            en: item.stratigraphy_en,
          })
        }}
      </nuxt-link>
    </template>
    <template #item.lithostratigraphy="{ item }">
      <nuxt-link
        v-if="item.lithostratigraphy_id"
        class="text-link"
        :to="
          localePath({
            name: 'stratigraphy-id',
            params: { id: item.lithostratigraphy_id },
          })
        "
      >
        {{
          $translate({
            et: item.lithostratigraphy,
            en: item.lithostratigraphy_en,
          })
        }}
      </nuxt-link>
    </template>
    <template #item.taxon="{ item }">
      <external-link
        v-if="item.taxon_id"
        @click.native="$openWindow(`https://fossiilid.info/${item.taxon_id}`)"
      >
        {{ item.taxon }}
      </external-link>
    </template>
    <template #item.rock="{ item }">
      <external-link
        v-if="item.rock_id"
        @click.native="$openWindow(`https://kivid.info/${item.rock_id}`)"
      >
        {{
          $translate({
            et: item.rock,
            en: item.rock_en,
          })
        }}
      </external-link>
    </template>
    <template #item.image="{ item }">
      <image-cell
        v-if="item.image_preview_url"
        :src="item.image_preview_url"
        class="ma-2"
        @click="$openGeoDetail('specimen', item.id)"
      />
    </template>
    <template #item.name="{ item }">
      <external-link
        v-if="item.rock_id"
        @click.native="$openWindow(`https://kivid.info/${item.rock_id}`)"
      >
        {{
          $translate({
            et: item.rock,
            en: item.rock_en,
          })
        }}
      </external-link>
      <external-link
        v-if="item.taxon_id"
        @click.native="$openWindow(`https://fossiilid.info/${item.taxon_id}`)"
      >
        {{ item.taxon }}
      </external-link>
    </template>
  </table-wrapper>
</template>

<script>
import { round, cloneDeep } from 'lodash'
import { mapState } from 'vuex'

import TableWrapper from '~/components/tables/TableWrapper.vue'
import ImageCell from '~/components/ImageCell'
import ExternalLink from '~/components/ExternalLink'
import headersMixin from '~/mixins/headersMixin'
import { HEADERS_SPECIMEN } from '~/constants'
export default {
  name: 'SpecimenTable',
  components: { ExternalLink, TableWrapper, ImageCell },
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
    useDynamicHeaders: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      localHeaders: cloneDeep(HEADERS_SPECIMEN),
      module: 'specimen',
    }
  },
  computed: {
    ...mapState('headers', { stateHeaders: 'specimen' }),
  },
  methods: {
    round,
  },
}
</script>
