<template>
  <table-wrapper
    v-bind="{ showSearch }"
    :flat="$attrs.flat"
    :headers="headers"
    :items="items"
    :options="options"
    :count="count"
    v-on="$listeners"
  >
    <template #item.id="{ item }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'photo-id', params: { id: item.id } })"
      >
        {{ item.id }}
      </nuxt-link>
    </template>
    <template #item.image_number="{ item }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'photo-id', params: { id: item.id } })"
      >
        {{ item.image_number }}
      </nuxt-link>
    </template>
    <template #item.locality="{ item }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'locality-id', params: { id: item.id } })"
      >
        {{ $translate({ et: item.locality, en: item.locality_en }) }}
      </nuxt-link>
    </template>

    <template #item.date="{ item }">
      <div v-if="item.date_created">
        {{ new Date(item.date_created).toISOString().split('T')[0] }}
      </div>
      <div v-else>{{ item.date_created_free }}</div>
    </template>
  </table-wrapper>
</template>

<script>
import { round } from 'lodash'
import TableWrapper from '~/components/tables/TableWrapper.vue'
export default {
  name: 'PhotoTable',
  components: { TableWrapper },
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
        { text: this.$t('image.id'), value: 'id' },
        { text: this.$t('image.number'), value: 'image_number' },
        { text: this.$t('image.agent'), value: 'agent' },
        { text: this.$t('image.date'), value: 'date' },
        { text: this.$t('image.locality'), value: 'locality' },
        { text: this.$t('image.imageObject'), value: 'image_object' },
        { text: this.$t('image.tags'), value: 'tags' },
      ],
    }
  },
  methods: {
    round,
  },
}
</script>
