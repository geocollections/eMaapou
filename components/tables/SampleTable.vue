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
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'sample-id', params: { id: item.id } })"
      >
        {{ item.id }}
      </nuxt-link>
    </template>
    <template #item.number="{ item }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'sample-id', params: { id: item.id } })"
      >
        {{ item.number }}
      </nuxt-link>
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
    <template #item.stratigraphy="{ item }">
      <outer-link
        v-if="item.stratigraphy_id"
        :value="
          $translate({
            et: item.stratigraphy,
            en: item.stratigraphy_en,
          })
        "
        @click.native="
          $openWindow(`http://stratigraafia.info/term/${item.stratigraphy_id}`)
        "
      />
    </template>
    <template #item.lithostratigraphy="{ item }">
      <outer-link
        v-if="item.lithostratigraphy_id"
        class="font-italic"
        :value="
          $translate({
            et: item.lithostratigraphy,
            en: item.lithostratigraphy_en,
          })
        "
        @click.native="
          $openWindow(
            `http://stratigraafia.info/term/${item.lithostratigraphy_id}`
          )
        "
      />
    </template>
    <template #item.date_collected="{ item }">
      {{
        item.date_collected
          ? new Date(item.date_collected).toISOString().split('T')[0]
          : null
      }}
    </template>
  </table-wrapper>
</template>

<script>
import { round } from 'lodash'
import TableWrapper from '~/components/tables/TableWrapper.vue'
import OuterLink from '~/components/OuterLink'

export default {
  name: 'SampleTable',
  components: { OuterLink, TableWrapper },
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
        { text: this.$t('sample.id'), value: 'id' },
        { text: this.$t('sample.number'), value: 'number' },
        { text: this.$t('sample.locality'), value: 'locality' },
        { text: this.$t('sample.depth'), value: 'depth' },
        { text: this.$t('sample.depthInterval'), value: 'depth_interval' },
        { text: this.$t('sample.stratigraphy'), value: 'stratigraphy' },
        {
          text: this.$t('sample.lithostratigraphy'),
          value: 'lithostratigraphy',
        },
        { text: this.$t('sample.collector'), value: 'collector' },
        { text: this.$t('sample.dateCollected'), value: 'date_collected' },
      ],
    }
  },
  methods: {
    round,
  },
}
</script>
