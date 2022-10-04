<template>
  <search>
    <template #title>
      <base-header
        :title="$t('drillcore.pageTitle')"
        icon="mdi-screw-machine-flat-top"
      />
    </template>

    <template #form>
      <search-form-drillcore />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>
      <v-card>
        <data-table-drillcore
          :show-search="false"
          :items="items"
          :count="count"
          :options="options"
          :flat="false"
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
      title: this.$t('drillcore.pageTitle'),
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.$t('drillcore.pageTitle'),
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
    ...mapState('search/drillcore', ['options', 'items', 'count']),
  },
  methods: {
    ...mapActions('search/drillcore', ['searchDrillcores']),
    handleUpdate(tableState) {
      this.searchDrillcores(tableState?.options)
    },
  },
}
</script>
