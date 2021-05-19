<template>
  <table-wrapper
    v-bind="{ showSearch }"
    :flat="$attrs.flat"
    :headers="useDynamicHeaders ? dynamicHeaders : headers"
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
import { mapState } from 'vuex'
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
    useDynamicHeaders: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      headers: [
        { text: this.$t('photo.id'), value: 'id' },
        { text: this.$t('photo.number'), value: 'image_number' },
        { text: this.$t('photo.agent'), value: 'agent' },
        { text: this.$t('photo.date'), value: 'date' },
        { text: this.$t('photo.locality'), value: 'locality' },
        { text: this.$t('photo.imageObject'), value: 'image_object' },
        { text: this.$t('photo.tags'), value: 'tags' },
      ],
    }
  },
  computed: {
    ...mapState('tableHeaders', {
      tableHeaders(state) {
        return state.photo.tableHeaders
      },
    }),

    dynamicHeaders() {
      return this.tableHeaders.reduce((prev, item) => {
        if (item.show) {
          prev.push({ ...item, text: this.$t(item.text) })
        }
        return prev
      }, [])
    },
  },
  methods: {
    round,
  },
}
</script>
