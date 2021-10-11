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
    <template #item.name="{ item }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'area-id', params: { id: item.id } })"
      >
        {{ $translate({ et: item.name, en: item.name_en }) }}
      </nuxt-link>
    </template>
    <template #item.county="{ item }">
      <span>{{ $translate({ et: item.maakond, en: item.maakond_en }) }}</span>
    </template>
    <template #item.type="{ item }">
      <span>
        {{ $translate({ et: item.area_type, en: item.area_type_en }) }}
      </span>
    </template>
  </table-wrapper>
</template>

<script>
import { round, cloneDeep } from 'lodash'
import { mapState } from 'vuex'
import TableWrapper from '~/components/tables/TableWrapper.vue'
import { HEADERS_AREA } from '~/constants'
import headersMixin from '~/mixins/headersMixin'
export default {
  name: 'AreaTable',
  components: { TableWrapper },
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
      localHeaders: cloneDeep(HEADERS_AREA),
      module: 'area',
    }
  },
  computed: {
    ...mapState('headers', { stateHeaders: 'area' }),
  },
  methods: {
    round,
  },
}
</script>
