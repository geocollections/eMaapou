<template>
  <div v-if="history.length > 0" class="flex-row d-flex align-center">
    <v-subheader style="height: 32px !important" class="pl-3 text-no-wrap">{{
      `${$t('common.history')}:`
    }}</v-subheader>
    <span class="pb-1 pt-2 history-viewer d-flex">
      <span
        v-for="(item, index) in history"
        :key="index"
        class="d-flex align-center"
      >
        <nuxt-link
          :id="`history-${index}`"
          class="text-link-grey history-link d-inline-block text-truncate"
          :style="`max-width: ${linkWidth}px`"
          :to="localePath({ path: item.to })"
        >
          {{ item.text }}
          <v-tooltip open-delay="500" bottom :activator="`#history-${index}`">
            <span>{{ item.text }}</span>
          </v-tooltip>
        </nuxt-link>
        <v-icon
          v-if="index !== history.length - 1"
          class="mx-1 divider"
          x-small
        >
          mdi-arrow-left
        </v-icon>
      </span>
    </span>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'HistoryViewer',
  computed: {
    ...mapState('history', ['history']),
    linkWidth() {
      if (this.$vuetify.breakpoint.lgAndUp) return 200

      return 100
    },
  },
}
</script>
<style scoped>
.history-viewer {
  white-space: nowrap;
  overflow-x: auto;
}

.history-viewer::-webkit-scrollbar {
  background: transparent;
  height: 4px;
}

.history-viewer::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.33);
  border-radius: 10px;
}

.history-viewer::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.66);
}

.history-link {
  font-size: 0.8em;
}

.divider {
  color: rgba(0, 0, 0, 0.38);
  font-size: 14px;
  vertical-align: top;
}
</style>
