<template>
  <table-wrapper
    v-bind="{ showSearch, externalOptions }"
    :headers="headers"
    :items="items"
    :init-options="options"
    :count="count"
    v-on="$listeners"
  >
    <template #item.identifier="{ item }">
      <outer-link
        :value="item.identifier"
        @click.native="
          $openWindow(`http://doi.geocollections.info/${item.identifier}`)
        "
      />
    </template>

    <template #item.datacite_created="{ item }">
      <div v-if="item.datacite_created">
        <div>
          {{ new Date(item.datacite_created).toISOString().split('T')[0] }}
        </div>
        <div
          v-if="
            item.datacite_updated &&
            item.datacite_created !== item.datacite_updated
          "
        >
          ({{ new Date(item.datacite_updated).toISOString().split('T')[0] }})
        </div>
      </div>
    </template>
  </table-wrapper>
</template>

<script>
import TableWrapper from '@/components/tables/TableWrapper.vue'
import OuterLink from '~/components/OuterLink'
export default {
  name: 'DoiTable',
  components: { OuterLink, TableWrapper },
  props: {
    showSearch: {
      type: Boolean,
      default: true,
    },
    externalOptions: {
      type: Boolean,
      default: false,
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
  data() {
    return {
      headers: [
        { text: this.$t('doi.identifier'), value: 'identifier' },
        { text: this.$t('doi.creators'), value: 'creators' },
        { text: this.$t('doi.reference_year'), value: 'reference_year' },
        { text: this.$t('doi.table_title'), value: 'title' },
        { text: this.$t('doi.resource'), value: 'resource' },
        { text: this.$t('doi.datacite_created'), value: 'datacite_created' },
      ],
    }
  },
}
</script>
