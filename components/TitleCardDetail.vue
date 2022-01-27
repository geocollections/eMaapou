<template>
  <title-card>
    <v-card-title
      class="
        d-flex
        align-start
        text-sm-h3
        font-weight-medium
        text-h4
        pt-1
        px-0 px-sm-3
      "
      style="word-break: normal"
    >
      <back-button-detail />
      <slot>
        {{ title }}
      </slot>
      <edit-button />
    </v-card-title>

    <template #before>
      <div v-if="$vuetify.breakpoint.smAndUp" class="d-flex px-0 px-sm-3 pb-0">
        <v-btn
          id="first-id"
          nuxt
          icon
          :disabled="!computedFirstId"
          :title="$t('common.first', { id: computedFirstId })"
          @click="
            debouncedNavigation(
              localePath({
                params: { ...$route.params, id: computedFirstId },
              })
            )
          "
        >
          <v-icon>mdi-page-first</v-icon>
          <v-tooltip bottom activator="#first-id">
            <span>{{ $t('common.first', { id: computedFirstId }) }}</span>
          </v-tooltip>
        </v-btn>

        <v-btn
          id="previous-id"
          nuxt
          icon
          :disabled="!computedPrevId"
          :title="$t('common.previous', { id: computedPrevId })"
          @click="
            debouncedNavigation(
              localePath({
                params: { ...$route.params, id: computedPrevId },
              })
            )
          "
        >
          <v-icon>mdi-chevron-left</v-icon>
          <v-tooltip bottom activator="#previous-id">
            <span>{{ $t('common.previous', { id: computedPrevId }) }}</span>
          </v-tooltip>
        </v-btn>

        <div
          class="
            d-flex
            align-center
            montserrat
            grey--text
            text--darken-1
            pt-0
            px-0 px-sm-3
          "
        >
          {{ $t(`breadcrumbs.${routeName}-id`, { id: $route.params.id }) }}
        </div>
        <v-btn
          id="next-id"
          nuxt
          icon
          :disabled="!computedNextId"
          :title="$t('common.next', { id: computedNextId })"
          @click="
            debouncedNavigation(
              localePath({
                params: { ...$route.params, id: computedNextId },
              })
            )
          "
        >
          <v-icon>mdi-chevron-right</v-icon>
          <v-tooltip bottom activator="#next-id">
            <span>{{ $t('common.next', { id: computedNextId }) }}</span>
          </v-tooltip>
        </v-btn>
        <v-btn
          id="last-id"
          nuxt
          icon
          :disabled="!computedLastId"
          :title="$t('common.last', { id: computedLastId })"
          @click="
            debouncedNavigation(
              localePath({
                params: { ...$route.params, id: computedLastId },
              })
            )
          "
        >
          <v-icon>mdi-page-last</v-icon>
          <v-tooltip bottom activator="#last-id">
            <span>{{ $t('common.last', { id: computedLastId }) }}</span>
          </v-tooltip>
        </v-btn>
      </div>
    </template>
  </title-card>
</template>

<script>
import { debounce } from 'lodash'
import BackButtonDetail from './BackButtonDetail.vue'
import EditButton from './EditButton.vue'
import TitleCard from './TitleCard.vue'

export default {
  name: 'TitleCardDetail',
  components: {
    EditButton,
    TitleCard,
    BackButtonDetail,
  },
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
    title: {
      type: String,
      required: false,
      default: '',
    },
  },
  computed: {
    computedPrevId() {
      return this.ids?.prev_id ?? 0
    },

    computedNextId() {
      return this.ids?.next_id ?? 0
    },

    computedLastId() {
      return this.ids?.last_id ?? 0
    },

    computedFirstId() {
      return this.ids?.first_id ?? 0
    },

    routeName() {
      return this.getRouteBaseName().split('-id')[0]
    },
  },
  beforeMount() {
    if (this.arrowKeys) window.addEventListener('keyup', this.handleKeyup)
  },
  beforeDestroy() {
    if (this.arrowKeys) window.removeEventListener('keyup', this.handleKeyup)
  },
  methods: {
    handleKeyup: debounce(function (e) {
      if (e.keyCode === 37) {
        // ArrowLeft
        if (this.computedPrevId) {
          this.$router.push(
            this.localePath({
              params: { ...this.$route.params, id: this.computedPrevId },
            })
          )
        }
      } else if (e.keyCode === 39) {
        // ArrowRight
        if (this.computedNextId) {
          this.$router.push(
            this.localePath({
              params: { ...this.$route.params, id: this.computedNextId },
            })
          )
        }
      }
    }, 200),

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

    debouncedNavigation: debounce(function (path) {
      this.$router.push(path)
    }, 200),
  },
}
</script>
