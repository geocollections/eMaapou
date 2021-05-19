<template>
  <v-card flat class="mt-1">
    <v-card-title class="py-1 px-0">
      <div
        class="card-title--clickable"
        @click="showExtraOptions = !showExtraOptions"
      >
        <span>{{ $t('common.extraOptions') }}</span>
        <v-icon class="pb-1">mdi-table-cog</v-icon>
      </div>
      <v-spacer></v-spacer>
      <v-btn icon @click="showExtraOptions = !showExtraOptions">
        <v-icon>{{
          showExtraOptions ? 'mdi-chevron-up' : 'mdi-chevron-down'
        }}</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text v-show="showExtraOptions" class="px-0 pb-3">
      <v-autocomplete
        :items="allTableHeaders"
        :value="shownTableHeaders"
        chips
        small-chips
        deletable-chips
        multiple
        hide-details
        cache-items
        :label="$t('common.tableHeaders')"
        @change="handleTableHeaderChange"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'ExtraOptions',
  computed: {
    ...mapState('tableHeaders', {
      analysis(state) {
        return state.analysis.tableHeaders
      },
      dataset(state) {
        return state.dataset.tableHeaders
      },
      drillcore(state) {
        return state.drillcore.tableHeaders
      },
      locality(state) {
        return state.locality.tableHeaders
      },
      photo(state) {
        return state.photo.tableHeaders
      },
      sample(state) {
        return state.sample.tableHeaders
      },
      site(state) {
        return state.site.tableHeaders
      },
      stratigraphy(state) {
        return state.stratigraphy.tableHeaders
      },
    }),
    ...mapFields('settings', ['showExtraOptions']),
    stateModuleName() {
      let table = this.getRouteBaseName()
      if (table === 'analytical_data') table = 'analyticalData'
      return table
    },
    allTableHeaders() {
      return this[this.stateModuleName].map((item) => {
        return {
          ...item,
          text: this.$t(item.text),
        }
      })
    },

    shownTableHeaders() {
      return this.allTableHeaders.filter((item) => item.show)
    },
  },
  methods: {
    ...mapActions('tableHeaders', ['updateTableHeaders']),
    handleTableHeaderChange(headers) {
      this.updateTableHeaders({ module: this.stateModuleName, headers })
    },
  },
}
</script>

<style scoped lang="scss">
.card-title--clickable {
  transition: opacity 200ms ease-in-out;

  &:hover {
    cursor: pointer;
    opacity: 0.7;
  }
}
</style>
