<template>
  <div>
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
            localePath({
              name: 'locality-id',
              params: { id: item.locality_id },
            })
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
          class="my-1"
          :src="
            $img(item.image, { size: 'small' }, { provider: 'geocollections' })
          "
          @click="
            openOverlay({
              src: item.image,
              modifiers: { size: 'large' },
              options: { provider: 'geocollections' },
              id: item.attachment_id,
            })
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
      <template #item.original_status="{ item }">
        {{
          $translate({ et: item.original_status, en: item.original_status_en })
        }}
      </template>
    </base-data-table>
    <image-overlay v-model="showOverlay" :image="overlayImage" />
  </div>
</template>

<script lang="ts">
import round from 'lodash/round'
import cloneDeep from 'lodash/cloneDeep'
import { mapState } from 'vuex'
import { defineComponent, ref } from '@nuxtjs/composition-api'

import BaseDataTable from '~/components/base/BaseDataTable.vue'
import ThumbnailImage from '~/components/thumbnail/ThumbnailImage.vue'
import BaseLinkExternal from '~/components/base/BaseLinkExternal.vue'
import ImageOverlay, { OverlayImage } from '~/components/ImageOverlay.vue'
import headersMixin from '~/mixins/headersMixin'
import { HEADERS_SPECIMEN } from '~/constants'
export default defineComponent({
  name: 'DataTableSpecimen',
  components: { BaseLinkExternal, BaseDataTable, ThumbnailImage, ImageOverlay },
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
  setup() {
    const showOverlay = ref(false)
    const overlayImage = ref<OverlayImage>()
    const openOverlay = (image: OverlayImage) => {
      overlayImage.value = image
      showOverlay.value = true
    }
    return { showOverlay, overlayImage, openOverlay }
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
})
</script>
