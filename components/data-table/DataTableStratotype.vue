<template>
  <base-data-table
    v-bind="$attrs"
    :headers="headers"
    :items="items"
    :options="options"
    :count="count"
    v-on="$listeners"
    @change:headers="handleHeadersChange"
    @reset:headers="handleHeadersReset"
  >
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
    <template #item.type="{ item }">
      <div v-if="item.stratotype_type">
        {{
          $translate({
            et: item.stratotype_type.value,
            en: item.stratotype_type.value_en,
          })
        }}
      </div>
    </template>
    <template #item.reference="{ item }">
      <base-link-external
        v-if="item.reference"
        @click.native="$openGeology('reference', item.reference.id)"
      >
        {{ item.reference.reference }}
      </base-link-external>
    </template>
  </base-data-table>
</template>

<script lang="ts">
import { toRef, defineComponent } from '@nuxtjs/composition-api'
import { useHeaders } from '~/composables/useHeaders'
import BaseDataTable from '~/components/base/BaseDataTable.vue'
import BaseLinkExternal from '~/components/base/BaseLinkExternal.vue'
import { HEADERS_STRATOTYPE } from '~/constants'
export default defineComponent({
  name: 'DataTableStratotype',
  components: { BaseLinkExternal, BaseDataTable },
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
      localHeaders: HEADERS_STRATOTYPE,
      options: toRef(props, 'options'),
    })
    return { headers, handleHeadersReset, handleHeadersChange }
  },
})
</script>
