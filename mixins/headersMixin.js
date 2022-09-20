import { mapActions } from 'vuex'

export default {
  props: {
    statefulHeaders: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    $_headers() {
      const translateHeader = (header) => {
        return {
          ...header,
          text:
            header.translate === undefined || header.translate
              ? this.$t(header.text)
              : header.text,
        }
      }

      if (this.statefulHeaders)
        return this.stateHeaders.allIds.map((id) =>
          translateHeader(this.stateHeaders.byIds[id])
        )
      return this.localHeaders.allIds.map((id) =>
        translateHeader(this.localHeaders.byIds[id])
      )
    },
  },
  methods: {
    ...mapActions('headers', ['resetHeaders', 'toggleHeader']),
    $_handleHeadersChange(e) {
      if (this.statefulHeaders)
        this.toggleHeader({ module: this.module, headerId: e })
      else this.localHeaders.byIds[e].show = !this.localHeaders.byIds[e].show
    },
    $_handleHeadersReset() {
      if (this.statefulHeaders)
        this.resetHeaders({ module: this.module, options: this.options })
      else {
        this.localHeaders = this.$options.data.call(this).localHeaders

        this.options.sortBy.forEach((headerId) => {
          this.localHeaders.byIds[headerId].show = true
        })
      }
    },
  },
}
