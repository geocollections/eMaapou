<template>
  <table-wrapper
    v-bind="{ showSearch, externalOptions }"
    :headers="headers"
    :items="items"
    :init-options="options"
    :count="count"
    v-on="$listeners"
  >
    <template #item.id="{ item }">
      <a class="text-link" @click="$openGeoDetail('specimen', item.id)">
        {{ item.id }}
        <v-icon color="deep-orange darken-2" small>mdi-open-in-new</v-icon>
      </a>
    </template>
    <template #item.specimen_number="{ item }">
      <a class="text-link" @click="$openGeoDetail('specimen', item.id)">
        {{ item.specimen_number }}
        <v-icon color="deep-orange darken-2" small>mdi-open-in-new</v-icon>
      </a>
    </template>
    <template #item.locality="{ item }">
      <nuxt-link
        class="text-link"
        :to="
          localePath({ name: 'locality-id', params: { id: item.locality_id } })
        "
      >
        {{ $translate({ et: item.locality, en: item.locality_en }) }}
      </nuxt-link>
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
      <a
        v-if="item.stratigraphy_id"
        class="text-link"
        @click="
          $openWindow(`http://stratigraafia.info/term/${item.stratigraphy_id}`)
        "
      >
        {{
          $translate({
            et: item.stratigraphy,
            en: item.stratigraphy_en,
          })
        }}
        <v-icon color="deep-orange darken-2" small>mdi-open-in-new</v-icon>
      </a>
    </template>
    <template #item.lithostratigraphy="{ item }">
      <a
        v-if="item.lithostratigraphy_id"
        class="text-link"
        @click="
          $openWindow(
            `http://stratigraafia.info/term/${item.lithostratigraphy_id}`
          )
        "
      >
        {{
          $translate({
            et: item.lithostratigraphy,
            en: item.lithostratigraphy_en,
          })
        }}
        <v-icon color="deep-orange darken-2" small>mdi-open-in-new</v-icon>
      </a>
    </template>
    <template #item.taxon="{ item }">
      <a
        v-if="item.taxon_id"
        class="text-link"
        @click="$openWindow(`https://fossiilid.info/${item.taxon_id}`)"
      >
        {{ item.taxon }}
        <v-icon color="deep-orange darken-2" small>mdi-open-in-new</v-icon>
      </a>
    </template>
    <template #item.rock="{ item }">
      <a
        v-if="item.rock_id"
        class="text-link"
        @click="$openWindow(`https://kivid.info/${item.rock_id}`)"
      >
        {{
          $translate({
            et: item.rock,
            en: item.rock_en,
          })
        }}
        <v-icon color="deep-orange darken-2" small>mdi-open-in-new</v-icon>
      </a>
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
export default {
  name: 'SpecimenTable',
  components: { TableWrapper, ImageCell },
  props: {
    showSearch: {
      type: Boolean,
      default: true,
    },
    externalOptions: {
      type: Boolean,
      default: false,
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
        { text: this.$t('specimen.image'), value: 'image', sortable: false },
      ],
    }
  },
  methods: {
    round,
  },
}
</script>
