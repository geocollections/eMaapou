<template>
  <div class="d-flex justify-space-between px-4">
    <div>
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            nuxt
            icon
            :disabled="!computedFirstId"
            :title="$t('common.first')"
            :to="
              localePath({
                params: { id: computedFirstId },
              })
            "
            v-on="on"
          >
            <v-icon>mdi-page-first</v-icon>
          </v-btn>
        </template>

        <span>{{ $t('common.first') }}</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            nuxt
            icon
            :disabled="!computedPrevId"
            :title="$t('common.previous')"
            :to="
              localePath({
                params: { id: computedPrevId },
              })
            "
            v-on="on"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </template>

        <span>{{ $t('common.previous') }}</span>
      </v-tooltip>
    </div>

    <div>
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            nuxt
            icon
            :disabled="!computedNextId"
            :title="$t('common.next')"
            :to="
              localePath({
                params: { id: computedNextId },
              })
            "
            v-on="on"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </template>

        <span>{{ $t('common.next') }}</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            nuxt
            icon
            :disabled="!computedLastId"
            :title="$t('common.last')"
            :to="
              localePath({
                params: { id: computedLastId },
              })
            "
            v-on="on"
          >
            <v-icon>mdi-page-last</v-icon>
          </v-btn>
        </template>

        <span>{{ $t('common.last') }}</span>
      </v-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrevNextNav',
  props: {
    arrowKeys: {
      type: Boolean,
      required: false,
      default: true,
    },
    listOfIds: {
      type: Array,
      required: false,
      default: () => [],
    },
    ids: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  computed: {
    computedPrevId() {
      return this.ids?.prev_id
    },

    computedNextId() {
      return this.ids?.next_id
    },

    computedLastId() {
      return this.ids?.last_id
    },

    computedFirstId() {
      return this.ids?.first_id
    },
  },
  beforeMount() {
    if (this.arrowKeys) window.addEventListener('keyup', this.handleKeyup)
  },
  beforeDestroy() {
    if (this.arrowKeys) window.removeEventListener('keyup', this.handleKeyup)
  },
  methods: {
    handleKeyup(e) {
      if (e.keyCode === 37) {
        // ArrowLeft
        if (this.computedPrevId) {
          this.$router.push(
            this.localePath({
              params: { id: this.computedPrevId },
            })
          )
        }
      } else if (e.keyCode === 39) {
        // ArrowRight
        if (this.computedNextId) {
          this.$router.push(
            this.localePath({
              params: { id: this.computedNextId },
            })
          )
        }
      }
    },

    calculatePreviousId(listOfIds, currentId) {
      if (listOfIds && listOfIds.length > 0 && currentId) {
        const currentIndex = listOfIds.indexOf(parseInt(currentId))
        const previousIndex = currentIndex - 1

        if (previousIndex >= 0) return listOfIds[previousIndex]
        else return null
      }
    },

    calculateNextId(listOfIds, currentId) {
      if (listOfIds && listOfIds.length > 0 && currentId) {
        const currentIndex = listOfIds.indexOf(parseInt(currentId))
        const nextIndex = currentIndex + 1

        if (nextIndex >= 0 && nextIndex < listOfIds.length)
          return listOfIds[nextIndex]
        else return null
      }
    },
  },
}
</script>
