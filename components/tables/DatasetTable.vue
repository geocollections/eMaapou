<template>
  <table-wrapper
    v-bind="{ showSearch }"
    :headers="headers"
    :items="items"
    :options="options"
    :count="count"
    v-on="$listeners"
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
        {{ new Date(item.date).toISOString().split('T')[0] }}
      </div>
      <div v-else>{{ item.date_txt }}</div>
    </template>

    <template #item.database_acronym="{ item }">
      <external-link
        v-if="
          item.database_acronym === 'GIT' ||
          item.database_acronym === 'TUG' ||
          item.database_acronym === 'ELM'
        "
        @click.native="
          $openWindow(
            `https://geocollections.info/${item.database_acronym.toLowerCase()}`
          )
        "
        >{{ item.database_acronym }}</external-link
      >
      <div v-else>{{ item.database_acronym }}</div>
    </template>
  </table-wrapper>
</template>

<script>
import TableWrapper from '@/components/tables/TableWrapper.vue'
import ExternalLink from '~/components/ExternalLink'
export default {
  name: 'DatasetTable',
  components: { ExternalLink, TableWrapper },
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
