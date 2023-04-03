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
    <template #item.reference="{ item }">
      <base-link-external
        v-if="item.id"
        @click.native="$openGeology('reference', item.id)"
      >
        {{ item.reference }}
      </base-link-external>
    </template>

    <template #item.journal="{ item }">
      <div v-if="item.journal__journal_name">
        {{ item.journal__journal_name }}
      </div>
      <div v-else-if="item.book">{{ item.book }}</div>
    </template>

    <template #item.doi="{ item }">
      <base-link-external
        v-if="item.doi"
        @click.native="$openWindow(`https://doi.org/${item.doi}`)"
      >
        {{ item.doi }}
      </base-link-external>
    </template>
    <template #item.pdf="{ item }">
      <v-chip
        v-if="item.pdf"
        color="red "
        :ripple="false"
        outlined
        small
        target="_blank"
        rel="noopener"
        class="d-print-none ml-1 my-1 link"
        @click.stop="openPDF(item.pdf)"
      >
        <v-icon class="pr-1">{{ icons.mdiFilePdfBox }}</v-icon>
        <b>PDF</b>
      </v-chip>
    </template>
  </base-data-table>
</template>

<script lang="ts">
import { mdiFilePdfBox } from '@mdi/js'
import { computed, defineComponent, toRef } from '@nuxtjs/composition-api'
import { useHeaders } from '~/composables/useHeaders'
import BaseDataTable from '~/components/base/BaseDataTable.vue'
import BaseLinkExternal from '~/components/base/BaseLinkExternal.vue'
import { HEADERS_REFERENCE } from '~/constants'

export default defineComponent({
  name: 'DataTableReference',
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
    const icons = computed(() => ({ mdiFilePdfBox }))
    const openPDF = (link: string) => {
      window.open(link, '_blank', 'height=800, width=800')
    }
    const { headers, handleHeadersChange, handleHeadersReset } = useHeaders({
      localHeaders: HEADERS_REFERENCE,
      options: toRef(props, 'options'),
    })
    return { icons, openPDF, headers, handleHeadersReset, handleHeadersChange }
  },
})
</script>
