<template>
  <table-wrapper
    v-bind="{ showSearch, externalOptions }"
    :headers="headers"
    :items="items"
    :init-options="options"
    :count="count"
    v-on="$listeners"
  >
    <template #item.id="{ item }">
      <outer-link
        :value="item.id"
        @click.native="$openGeoDetail('dataset', item.id)"
      />
    </template>

    <template #item.name="{ item }">
      <outer-link
        :value="$translate({ et: item.name, en: item.name_en })"
        @click.native="$openGeoDetail('dataset', item.id)"
      />
    </template>

    <template #item.date="{ item }">
      <div v-if="item.date">
        {{ new Date(item.date).toISOString().split('T')[0] }}
      </div>
      <div v-else>{{ item.date_txt }}</div>
    </template>

    <template #item.database_acronym="{ item }">
      <outer-link
        v-if="
          item.database_acronym === 'GIT' ||
          item.database_acronym === 'TUG' ||
          item.database_acronym === 'ELM'
        "
        :value="item.database_acronym"
        @click.native="
          $openWindow(
            `https://geocollections.info/${item.database_acronym.toLowerCase()}`
          )
        "
      />
      <div v-else>{{ item.database_acronym }}</div>
    </template>
  </table-wrapper>
</template>

<script>
import TableWrapper from '@/components/tables/TableWrapper.vue'
import OuterLink from '~/components/OuterLink'
export default {
  name: 'DatasetTable',
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
        { text: this.$t('dataset.id'), value: 'id' },
        { text: this.$t('dataset.name'), value: 'name' },
        { text: this.$t('dataset.date'), value: 'date' },
        { text: this.$t('dataset.database'), value: 'database_acronym' },
      ],
    }
  },
}
</script>
