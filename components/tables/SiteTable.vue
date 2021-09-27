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
    <template #item.id="{ item }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'site-id', params: { id: item.id } })"
      >
        {{ item.id }}
      </nuxt-link>
    </template>
    <template #item.name="{ item }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'site-id', params: { id: item.id } })"
      >
        {{
          $translate({
            et: item.name,
            en: item.name_en,
          })
        }}
      </nuxt-link>
    </template>
    <template #item.area="{ item }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'area-id', params: { id: item.area_id } })"
      >
        {{
          $translate({
            et: item.area_name,
            en: item.area_name_en,
          })
        }}
      </nuxt-link>
    </template>
  </table-wrapper>
</template>

<script>
import { round, cloneDeep } from 'lodash'
import { mapState } from 'vuex'
import TableWrapper from '~/components/tables/TableWrapper.vue'
import { HEADERS_SITE } from '~/constants'
import headersMixin from '~/mixins/headersMixin'
export default {
  name: 'SiteTable',
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
      localHeaders: cloneDeep(HEADERS_SITE),
      module: 'site',
    }
  },
  computed: {
    ...mapState('headers', { stateHeaders: 'site' }),
  },
  methods: {
    round,
  },
}
</script>
