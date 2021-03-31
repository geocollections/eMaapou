<template>
  <div class="d-flex justify-space-between px-4">
    <nuxt-link
      v-if="prevId > 0"
      class="text-link"
      :to="
        localePath({
          params: { id: prevId },
        })
      "
    >
      {{ $t('common.previous') }}
    </nuxt-link>
    <div v-else />

    <nuxt-link
      v-if="listOfIds.length === 0 || listOfIds.includes(nextId)"
      class="text-link"
      :to="
        localePath({
          params: { id: nextId },
        })
      "
    >
      {{ $t('common.next') }}
    </nuxt-link>
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
  },
  computed: {
    prevId() {
      return (
        this.calculatePreviousId(this.listOfIds, this.$route.params.id) ??
        parseInt(this.$route.params.id) - 1
      )
    },

    nextId() {
      return (
        this.calculateNextId(this.listOfIds, this.$route.params.id) ??
        parseInt(this.$route.params.id) + 1
      )
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
        if (this.prevId > 0) {
          this.$router.push(
            this.localePath({
              params: { id: this.prevId },
            })
          )
        }
      } else if (e.keyCode === 39) {
        // ArrowRight
        if (
          this.listOfIds.length === 0 ||
          this.listOfIds.includes(this.nextId)
        ) {
          this.$router.push(
            this.localePath({
              params: { id: this.nextId },
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
