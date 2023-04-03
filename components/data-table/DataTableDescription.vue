<template>
  <base-data-table
    expandable
    v-bind="$attrs"
    :headers="headers"
    :items="items"
    :options="options"
    :count="count"
    v-on="$listeners"
    @change:headers="handleHeadersChange"
    @reset:headers="handleHeadersReset"
  >
    <!-- eslint-disable-next-line vue/no-template-shadow -->
    <template #expanded-item="{ headers, item }">
      <td class="py-2" :colspan="headers.length">
        <v-row no-gutters>
          <v-col class="pt-2 pb-4 pr-2">
            <div class="font-weight-bold">
              {{ $t('drillcore.description') }}
            </div>
            <div>
              {{ item.description }}
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <base-table>
              <table-row
                :title="$t('localityDescription.zeroLevel')"
                :value="item.zero_level"
              />
              <table-row
                :title="$t('localityDescription.authorFree')"
                :value="item.author_free"
              />
              <table-row-link
                v-if="item.reference"
                :title="$t('localityDescription.reference')"
                :value="item.reference.reference"
                @link-click="$openGeology('reference', item.reference.id)"
              />
              <table-row
                :title="$t('localityDescription.year')"
                :value="item.year"
              />
              <table-row
                :title="$t('localityDescription.stratigraphyFree')"
                :value="item.stratigraphy_free"
              />
              <table-row
                v-if="item.rock"
                :title="$t('localityDescription.rockEt')"
                :value="item.rock.name"
              />
              <table-row
                v-if="item.rock"
                :title="$t('localityDescription.rockEn')"
                :value="item.rock.name_en"
              />
              <table-row
                :title="$t('localityDescription.remarks')"
                :value="item.remarks"
              />
            </base-table>
          </v-col>
        </v-row>
      </td>
    </template>
    <template #item.rock="{ item }">
      <div v-if="item.rock">
        {{ $translate({ et: item.rock.name, en: item.rock.name_en }) }}
      </div>
    </template>
    <template #item.thickness="{ item }">
      {{
        !item.depth_base || !item.depth_top
          ? null
          : Math.abs(round(item.depth_base - item.depth_top, 3))
      }}
    </template>
    <template #item.stratigraphy="{ item }">
      <nuxt-link
        v-if="item.stratigraphy"
        class="text-link"
        :to="
          localePath({
            name: 'stratigraphy-id',
            params: { id: item.stratigraphy.id },
          })
        "
      >
        {{
          $translate({
            et: item.stratigraphy.stratigraphy,
            en: item.stratigraphy.stratigraphy_en,
          })
        }}
      </nuxt-link>
    </template>
    <template #item.author="{ item }">
      <a
        v-if="item.reference"
        :class="{ 'is-preferred': !item.is_preferred, 'text-link': true }"
        @click="$openGeology('reference', item.reference.id)"
      >
        {{ item.reference.reference }}
      </a>
      <div
        v-else-if="item.agent"
        :class="{ 'is-preferred': !item.is_preferred }"
      >
        {{ item.agent.agent }}
      </div>
      <div v-else :class="{ 'is-preferred': !item.is_preferred }">
        {{ item.author_free }}
      </div>
    </template>
  </base-data-table>
</template>

<script lang="ts">
import { defineComponent, toRef } from '@nuxtjs/composition-api'
import round from 'lodash/round'
import { useHeaders } from '~/composables/useHeaders'
import TableRow from '~/components/table/TableRow.vue'
import TableRowLink from '~/components/table/TableRowLink.vue'
import BaseTable from '~/components/base/BaseTable.vue'
import BaseDataTable from '~/components/base/BaseDataTable.vue'
import { HEADERS_DESCRIPTION } from '~/constants'
export default defineComponent({
  name: 'DataTableDescription',
  components: { BaseDataTable, TableRow, TableRowLink, BaseTable },
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
  setup(props) {
    const { headers, handleHeadersChange, handleHeadersReset } = useHeaders({
      localHeaders: HEADERS_DESCRIPTION,
      options: toRef(props, 'options'),
    })
    return { headers, handleHeadersReset, handleHeadersChange, round }
  },
})
</script>
