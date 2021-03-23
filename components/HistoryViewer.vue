<template>
  <div class="d-flex flex-row align-center">
    <v-subheader class="pr-0">{{ `${$t('common.history')}:` }}</v-subheader>
    <v-breadcrumbs :items="history" divider="/">
      <template #item="{ item }">
        <v-breadcrumbs-item
          nuxt
          active-class=""
          :to="item.to"
          :disabled="item.disabled"
        >
          {{ $translate({ et: item.text.et, en: item.text.en }) }}
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
}
</script>
