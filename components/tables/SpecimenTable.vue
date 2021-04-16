<template>
  <table-wrapper
    v-bind="{ showSearch }"
    :headers="headers"
    :items="items"
    :options="options"
    :count="count"
    v-on="$listeners"
  >
    <template #item.id="{ item }">
      <external-link
        v-if="item.id"
        @click.native="$openGeoDetail('specimen', item.id)"
      >
        {{ item.id }}
      </external-link>
    </template>
    <template #item.specimen_number="{ item }">
      <external-link
        v-if="item.specimen_number"
        @click.native="$openGeoDetail('specimen', item.id)"
      >
        {{ item.specimen_number }}
      </external-link>
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
  </table-wrapper>
</template>

<script>
import { round } from 'lodash'
import TableWrapper from '@/components/tables/TableWrapper.vue'
import ImageCell from '@/components/ImageCell'
import ExternalLink from '~/components/ExternalLink'
export default {
  name: 'SpecimenTable',
  components: { ExternalLink, TableWrapper, ImageCell },
  props: {
    showSearch: {
      type: Boolean,
      default: true,
    },
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
      headers: [
        { text: this.$t('specimen.id'), value: 'id' },
        { text: this.$t('specimen.number'), value: 'specimen_number' },
        { text: this.$t('specimen.locality'), value: 'locality' },
        { text: this.$t('specimen.depth'), value: 'depth' },
        { text: this.$t('specimen.depthInterval'), value: 'depth_interval' },
        { text: this.$t('specimen.stratigraphy'), value: 'stratigraphy' },
        {
          text: this.$t('sample.lithostratigraphy'),
          value: 'lithostratigraphy',
        },
        // { text: this.$t('specimen.kind'), value: 'kind' },
        // { text: this.$t('specimen.fossilGroup'), value: 'fossilgroup' },
        { text: this.$t('specimen.taxon'), value: 'taxon' },
        { text: this.$t('specimen.rock'), value: 'rock' },
        { text: this.$t('specimen.image'), value: 'image' },
      ],
    }
  },
  methods: {
    round,
  },
}
</script>
