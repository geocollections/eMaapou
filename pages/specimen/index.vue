<template>
  <search>
    <template #title>
      <base-header :title="$t('specimen.pageTitle')" icon="mdi-microscope" />
    </template>

    <template #form>
      <search-form-specimen />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>

      <v-card>
        <data-table-specimen
          :show-search="false"
          :items="items"
          :count="count"
          :options="options"
          dynamic-headers
          stateful-headers
          @update="handleUpdate"
        />
      </v-card>
    </template>
  </search>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  head() {
    return {
      title: this.$t('specimen.pageTitle'),
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.$t('specimen.pageTitle'),
        },
        {
          property: 'og:url',
          hid: 'og:url',
          content: this.$route.path,
        },
      ],
    }
  },
  computed: {
    ...mapState('search/specimen', ['options', 'items', 'count']),
  },
  methods: {
    ...mapActions('search/specimen', ['searchSpecimens']),
    handleUpdate(tableState) {
      this.searchSpecimens(tableState?.options)
    },
  },
}
</script>
