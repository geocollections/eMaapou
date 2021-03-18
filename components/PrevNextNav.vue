<template>
  <div class="d-flex justify-space-between px-4">
    <nuxt-link
      class="text-link"
      :to="
        localePath({
          params: { id: parseInt($route.params.id) - 1 },
        })
      "
    >
      {{ $t('common.previous') }}
    </nuxt-link>

    <nuxt-link
      class="text-link"
      :to="
        localePath({
          params: { id: parseInt($route.params.id) + 1 },
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
        this.$router.push(
          this.localePath({
            params: { id: parseInt(this.$route.params.id) - 1 },
          })
        )
      } else if (e.keyCode === 39) {
        // ArrowRight
        this.$router.push(
          this.localePath({
            params: { id: parseInt(this.$route.params.id) + 1 },
          })
        )
      }
    },
  },
}
</script>
