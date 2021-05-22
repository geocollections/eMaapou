<template>
  <v-card
    class="d-flex justify-space-between px-4 flex-column flex-sm-row"
    :class="{ 'mb-3': title || $slots.title, [titleColor]: true }"
  >
    <div
      class="align-self-start align-self-sm-center text-no-wrap hidden-xs-only"
    >
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            nuxt
            icon
            :disabled="!computedFirstId"
            :title="$t('common.first', { id: computedFirstId })"
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

        <span>{{ $t('common.first', { id: computedFirstId }) }}</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            nuxt
            icon
            :disabled="!computedPrevId"
            :title="$t('common.previous', { id: computedPrevId })"
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

        <span>{{ $t('common.previous', { id: computedPrevId }) }}</span>
      </v-tooltip>
    </div>

    <slot name="title">
      <page-title
        class="text-center"
        :title="title"
        :subtitle="$t(`breadcrumbs.${routeName}-id`, { id: $route.params.id })"
      />
    </slot>

    <div
      class="align-self-end align-self-sm-center text-no-wrap hidden-xs-only"
    >
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            nuxt
            icon
            :disabled="!computedNextId"
            :title="$t('common.next', { id: computedNextId })"
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

        <span>{{ $t('common.next', { id: computedNextId }) }}</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            nuxt
            icon
            :disabled="!computedLastId"
            :title="$t('common.last', { id: computedLastId })"
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

        <span>{{ $t('common.last', { id: computedLastId }) }}</span>
      </v-tooltip>
    </div>
  </v-card>
</template>

<script>
import PageTitle from '~/components/PageTitle'
export default {
  name: 'PrevNextNavTitle',
  components: { PageTitle },
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

    titleColor() {
      let name = this.getRouteBaseName()
      if (name.includes('-')) name = name.split('-')[0]
      if (name === 'analysis' || name === 'analytical_data')
        return 'emp-analysis'
      if (name === 'dataset') return 'emp-dataset'
      if (name === 'preparation' || name === 'sample') return 'emp-sample'
      if (name === 'area') return 'emp-main'
      if (name === 'locality') return 'emp-locality'
      if (name === 'site') return 'emp-site'
      if (name === 'drillcore' || name === 'drillcore_box')
        return 'emp-drillcore'
      if (name === 'file' || name === 'photo') return 'emp-photo' // #bfbe8b or #8c6d4e
      if (name === 'stratigraphy') return 'emp-stratigraphy'
      return 'emp-main'
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
