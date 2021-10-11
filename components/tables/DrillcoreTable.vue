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
    <template #item.drillcore="{ item }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'drillcore-id', params: { id: item.id } })"
      >
        {{ $translate({ et: item.drillcore, en: item.drillcore_en }) }}
      </nuxt-link>
    </template>
  </table-wrapper>
</template>

<script>
import { round, cloneDeep } from 'lodash'
import { mapState } from 'vuex'
import TableWrapper from './TableWrapper.vue'
import { HEADERS_DRILLCORE } from '~/constants'
import headersMixin from '~/mixins/headersMixin'
export default {
  name: 'DrillcoreTable',
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
      localHeaders: cloneDeep(HEADERS_DRILLCORE),
      module: 'drillcore',
    }
  },
  computed: {
    ...mapState('headers', { stateHeaders: 'drillcore' }),
  },
  methods: {
    round,
  },
}
</script>
