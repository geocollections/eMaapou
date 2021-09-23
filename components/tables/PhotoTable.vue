<template>
  <table-wrapper-test
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
        {{ $formatDate(item.date_created) }}
      </div>
      <div v-else>{{ item.date_created_free }}</div>
    </template>
  </table-wrapper-test>
</template>

<script>
import { round, cloneDeep } from 'lodash'
import { mapState } from 'vuex'
import TableWrapperTest from '~/components/tables/TableWrapperTest.vue'
import headersMixin from '~/mixins/headersMixin'
import { HEADERS_PHOTO } from '~/constants'
export default {
  name: 'PhotoTable',
  components: { TableWrapperTest },
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
      localHeaders: cloneDeep(HEADERS_PHOTO),
      module: 'photo',
    }
  },
  computed: {
    ...mapState('headers', { stateHeaders: 'photo' }),
  },
  methods: {
    round,
  },
}
</script>
