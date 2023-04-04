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
    <template #item.rock="{ item }">
      <base-link-external
        v-if="item.rock"
        @click.native="$openWindow(`https://kivid.info/${item.rock.id}`)"
      >
        {{
          $translate({
            et: item.rock.name,
            en: item.rock.name_en,
          })
        }}
      </base-link-external>
    </template>
    <template #item.agent="{ item }">
      <div v-if="item.agent">
        {{ item.agent.agent }}
      </div>
    </template>
    <template #item.dateIdentified="{ item }">
      <div>{{ item.date_identified || item.date_identified_free }}</div>
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
      <div v-if="item.type">
        {{
          $translate({
            et: item.type.value,
            en: item.type.value_en,
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
import { HEADERS_SPECIMEN_IDENTIFICATION_GEOLOGY } from '~/constants'
import { useHeaders } from '~/composables/useHeaders'

export default defineComponent({
  name: 'DataTableSpecimenIdentificationGeology',
  components: { BaseDataTable, BaseLinkExternal, BaseBoolean },
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
  },
  setup(props) {
    const { headers, handleHeadersChange, handleHeadersReset } = useHeaders({
      localHeaders: HEADERS_SPECIMEN_IDENTIFICATION_GEOLOGY,
      options: toRef(props, 'options'),
    })
    return { headers, handleHeadersReset, handleHeadersChange }
  },
})
</script>
