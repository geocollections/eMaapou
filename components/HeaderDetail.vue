<template>
  <base-header>
    <v-card-title class="d-block pt-1 px-0 pb-3 px-sm-3">
      <div
        style="word-break: normal; flex-wrap: wrap"
        class="d-flex align-start font-weight-medium text-h4"
      >
        <slot>
          {{ title }}
        </slot>
        <edit-button />
      </div>
      <div>
        <slot name="sub" />
      </div>
    </v-card-title>

    <template #before>
      <div v-if="$vuetify.breakpoint.smAndUp" class="d-flex px-0 px-sm-3 pb-0">
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
          <v-icon>{{ icons.mdiChevronLeft }}</v-icon>
          <v-tooltip bottom activator="#previous-id">
            <span>{{ $t('common.previous', { id: computedPrevId }) }}</span>
          </v-tooltip>
        </v-btn>

        <back-button-detail />
        <div
          class="d-flex align-center montserrat grey--text text--darken-1 pt-0 px-0 px-sm-3"
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
          <v-icon>{{ icons.mdiChevronRight }}</v-icon>
          <v-tooltip bottom activator="#next-id">
            <span>{{ $t('common.next', { id: computedNextId }) }}</span>
          </v-tooltip>
        </v-btn>
      </div>
    </template>
  </base-header>
</template>

<script>
import { mdiChevronRight, mdiChevronLeft } from '@mdi/js'
import debounce from 'lodash/debounce'
import BackButtonDetail from './BackButtonDetail.vue'
import EditButton from './EditButton.vue'
import BaseHeader from './base/BaseHeader.vue'

export default {
  name: 'HeaderDetail',
  components: {
    EditButton,
    BaseHeader,
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
    icons() {
      return {
        mdiChevronRight,
        mdiChevronLeft,
      }
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
