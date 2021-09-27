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
    <template #item.preparation_number="{ item }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'preparation-id', params: { id: item.id } })"
      >
        {{ item.preparation_number }}
      </nuxt-link>
    </template>
    <template #item.locality="{ item }">
      <nuxt-link
        v-if="item.locality_en"
        class="text-link"
        :to="
          localePath({
            name: 'locality-id',
            params: { id: item.locality_id },
          })
        "
      >
        {{ $translate({ et: item.locality, en: item.locality_en }) }}
      </nuxt-link>
    </template>
    <template #item.depth="{ item }">
      <div>
        <span>{{ item.depth }}</span>
        <span v-if="item.depth_interval">({{ item.depth_interval }})</span>
      </div>
    </template>
    <template #item.stratigraphy="{ item }">
      <span v-if="item.stratigraphy_id || item.lithostratigraphy_id">
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

        <span v-if="item.lithostratigraphy_id"> | </span>
        <external-link
          v-if="item.lithostratigraphy_id"
          class="font-italic"
          @click.native="
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
        </external-link>
      </span>
    </template>
  </table-wrapper-test>
</template>

<script>
import { round, cloneDeep } from 'lodash'
import TableWrapperTest from '~/components/tables/TableWrapperTest.vue'
import ExternalLink from '~/components/ExternalLink'
import headersMixin from '~/mixins/headersMixin'
import { HEADERS_PREPARATION } from '~/constants'
export default {
  name: 'PreparationTable',
  components: { ExternalLink, TableWrapperTest },
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
      localHeaders: cloneDeep(HEADERS_PREPARATION),
    }
  },
  methods: {
    round,
  },
}
</script>
