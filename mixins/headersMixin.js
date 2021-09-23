import { cloneDeep } from 'lodash'
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
          text: this.$t(header.text),
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
    ...mapActions('headers', ['updateHeaders']),
    $_handleHeadersChange(e) {
      const tempHeaders = this.statefulHeaders
        ? cloneDeep(this.stateHeaders)
        : this.localHeaders

      Object.keys(tempHeaders.byIds).forEach((id) => {
        tempHeaders.byIds[id].show = false
      })

      e.forEach((id) => {
        tempHeaders.byIds[id].show = true
      })

      if (this.statefulHeaders)
        this.updateHeaders({ module: this.module, headers: tempHeaders })
      else this.localHeaders = tempHeaders
    },
  },
}
