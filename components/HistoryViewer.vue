<template>
  <div v-if="historyEntries.length > 0" class="d-flex align-center">
    <v-subheader style="height: 32px !important" class="pl-3 text-no-wrap">{{
      `${$t('common.history')}:`
    }}</v-subheader>
    <span class="pb-1 pt-2 history-viewer d-flex">
      <span
        v-for="(entry, index) in historyEntries"
        :key="index"
        class="d-flex align-center"
      >
        <nuxt-link
          :id="`history-${index}`"
          class="text-link-grey history-link d-inline-block text-truncate"
          :style="`max-width: ${linkWidth}px`"
          :to="localePath({ path: entry.to })"
        >
          {{ entry.title }}
          <v-tooltip open-delay="500" bottom :activator="`#history-${index}`">
            <span>{{ entry.title }}</span>
          </v-tooltip>
        </nuxt-link>
        <v-icon
          v-if="index !== historyEntries.length - 1"
          class="mx-1 divider"
          x-small
        >
          {{ icons.mdiArrowLeft }}
        </v-icon>
      </span>
    </span>
  </div>
</template>

<script lang="ts">
import { mdiArrowLeft } from '@mdi/js'
import { defineComponent } from '@nuxtjs/composition-api'
import { HistoryEntry } from '~/store/history'

export default defineComponent({
  name: 'HistoryViewer',
  computed: {
    historyEntries(): HistoryEntry[] {
      return this.$accessor.history.historyEntries
    },
    linkWidth(): number {
      if (this.$vuetify.breakpoint.lgAndUp) return 200
      return 100
    },
    icons(): any {
      return {
        mdiArrowLeft,
      }
    },
  },
})
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
