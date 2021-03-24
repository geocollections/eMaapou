<template>
  <div v-if="history.length > 0" class="d-flex flex-row align-center">
    <v-subheader class="pr-0">{{ `${$t('common.history')}:` }}</v-subheader>
    <v-breadcrumbs :items="historyWithIndices" divider="/">
      <template #item="{ item }">
        <v-breadcrumbs-item active-class="" @click.native="handleClick(item)">
          <div class="text-link">
            {{ $translate({ et: item.text.et, en: item.text.en }) }}
          </div>
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'HistoryViewer',
  computed: {
    ...mapState('history', ['history']),
    historyWithIndices() {
      return this.history.map((h, i) => {
        return { ...h, index: i }
      })
    },
  },
  watch: {
    '$i18n.locale': {
      handler(newValue) {
        if (this.history.length > 0) {
          const localizedHistory = this.history.map((breadcrumb) => {
            return {
              ...breadcrumb,
              to: this.localePath(breadcrumb.to, newValue),
            }
          })

          this.$setHistory(localizedHistory)
        }
      },
    },
  },
  methods: {
    handleClick(item) {
      this.$router.push({ path: item.to })
      this.$removeHistory(item.index)
    },
  },
}
</script>
