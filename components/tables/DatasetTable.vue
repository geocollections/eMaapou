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
        v-if="item.id"
        class="text-link"
        :to="localePath({ name: 'dataset-id', params: { id: item.id } })"
      >
        {{ item.id }}
      </nuxt-link>
    </template>

    <template #item.name="{ item }">
      <nuxt-link
        v-if="$translate({ et: item.name, en: item.name_en })"
        class="text-link"
        :to="localePath({ name: 'dataset-id', params: { id: item.id } })"
      >
        {{ $translate({ et: item.name, en: item.name_en }) }}
      </nuxt-link>
    </template>

    <template #item.date="{ item }">
      <div v-if="item.date">
        {{ $formatDate(item.date) }}
      </div>
      <div v-else>{{ item.date_txt }}</div>
    </template>

    <template #item.database_acronym="{ item }">
      <nuxt-link
        class="text-link"
        :to="
          localePath({
            name: `institution-${item.database_acronym.toLowerCase()}`,
          })
        "
      >
        {{ item.database_acronym }}
      </nuxt-link>
    </template>
  </table-wrapper>
</template>

<script>
import { cloneDeep } from 'lodash'
import { mapState } from 'vuex'
import TableWrapper from '@/components/tables/TableWrapper.vue'
import headersMixin from '~/mixins/headersMixin'
import { HEADERS_DATASET } from '~/constants'
export default {
  name: 'DatasetTable',
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
      localHeaders: cloneDeep(HEADERS_DATASET),
      module: 'dataset',
    }
  },
  computed: {
    ...mapState('headers', { stateHeaders: 'dataset' }),
  },
}
</script>
