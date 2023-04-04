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
    <template #item.name="{ item }">
      <base-link-external
        v-if="item.taxon"
        @click.native="$openWindow(`https://fossiilid.info/${item.taxon.id}`)"
      >
        {{ item.taxon.taxon }}
      </base-link-external>

      <div v-if="item.name">| {{ item.name }}</div>
    </template>
    <template #item.agent="{ item }">
      <div v-if="item.agent">
        {{ item.agent.agent }}
      </div>
    </template>
    <template #item.dateIdentified="{ item }">
      {{ item.date_identified }}
    </template>
    <template #item.reference="{ item }">
      <base-link-external
        v-if="item.reference"
        @click.native="$openGeology('reference', item.reference.id)"
      >
        {{ item.reference.reference }}
      </base-link-external>
    </template>
    <template #item.type="{ item }">
      <div v-if="item.identification_type">
        {{
          $translate({
            et: item.identification_type.value,
            en: item.identification_type.value_en,
          })
        }}
      </div>
    </template>
    <template #item.current="{ item }">
      <base-boolean :value="item.current" />
    </template>
  </base-data-table>
</template>

<script lang="ts">
import { defineComponent, toRef } from '@nuxtjs/composition-api'
import BaseLinkExternal from '../base/BaseLinkExternal.vue'
import BaseBoolean from '../base/BaseBoolean.vue'
import BaseDataTable from '~/components/base/BaseDataTable.vue'
import { HEADERS_SPECIMEN_IDENTIFICATION } from '~/constants'
import { useHeaders } from '~/composables/useHeaders'

export default defineComponent({
  name: 'DataTableSpecimenIdentification',
  components: { BaseDataTable, BaseLinkExternal, BaseBoolean },
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
      localHeaders: HEADERS_SPECIMEN_IDENTIFICATION,
      options: toRef(props, 'options'),
    })
    return { headers, handleHeadersReset, handleHeadersChange }
  },
})
</script>
