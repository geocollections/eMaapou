<template>
  <base-data-table
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
      <base-link-external
        v-if="item.taxon_id"
        @click.native="$openWindow(`https://fossiilid.info/${item.taxon_id}`)"
      >
        {{ item.taxon }}
      </base-link-external>
    </template>
    <template #item.image="{ item }">
      <thumbnail-image
        v-if="item.image_preview_url"
        :src="item.image_preview_url"
        class="ma-2"
        @click="
          $router.push(
            localePath({
              name: 'photo-id',
              params: { id: item.attachment_id },
            })
          )
        "
      />
    </template>
    <template #item.name="{ item }">
      <base-link-external
        v-if="item.rock_id"
        @click.native="$openWindow(`https://kivid.info/${item.rock_id}`)"
      >
        {{
          $translate({
            et: item.rock,
            en: item.rock_en,
          })
        }}
      </base-link-external>
      <base-link-external
        v-if="item.taxon_id"
        @click.native="$openWindow(`https://fossiilid.info/${item.taxon_id}`)"
      >
        {{ item.taxon }}
      </base-link-external>
    </template>
  </base-data-table>
</template>

<script>
import { round, cloneDeep } from 'lodash'
import { mapState } from 'vuex'

import BaseDataTable from '~/components/base/BaseDataTable.vue'
import ThumbnailImage from '~/components/thumbnail/ThumbnailImage'
import BaseLinkExternal from '~/components/base/BaseLinkExternal'
import headersMixin from '~/mixins/headersMixin'
import { HEADERS_SPECIMEN } from '~/constants'
export default {
  name: 'DataTableSpecimen',
  components: { BaseLinkExternal, BaseDataTable, ThumbnailImage },
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