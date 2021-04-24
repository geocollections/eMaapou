<template>
  <div v-if="history.length > 0" class="d-flex flex-row align-center">
    <v-subheader class="pb-1">{{ `${$t('common.history')}:` }}</v-subheader>
    <span class="history-viewer pb-1">
      <span v-for="(item, index) in history" :key="index">
        <nuxt-link
          class="text-link-grey history-link"
          :to="localePath({ path: item.to })"
        >
          {{ $t(item.text, { id: item.id }) }}
        </nuxt-link>
        <span v-if="index !== history.length - 1" class="divider mx-1">
          {{ divider }}
        </span>
      </span>
    </span>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'HistoryViewer',
  props: {
    divider: {
      type: String,
      required: false,
      default: '←',
    },
  },
  computed: {
    ...mapState('history', ['history']),
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
