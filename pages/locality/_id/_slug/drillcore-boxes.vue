<template>
  <div>
    <list-drillcore-box
      :options="options"
      :count="count"
      :items="boxes"
      :is-loading="$fetchState.pending"
      @update="handleUpdate"
    />
  </div>
</template>

<script>
import { HEADERS_ATTACHMENT } from '~/constants'
import ListDrillcoreBox from '~/components/list/ListDrillcoreBox.vue'

export default {
  components: { ListDrillcoreBox },
  props: {
    drillcore: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      options: {
        page: 1,
        itemsPerPage: 10,
        sortBy: [],
        sortDesc: [],
      },
      boxes: [],
      count: 0,
      search: '',
    }
  },
  async fetch() {
    const attachmentResponse = await this.$services.sarvREST.getResourceList(
      'attachment_link',
      {
        search: this.search,
        options: this.options,
        defaultParams: {
          ordering: 'drillcore_box__depth_start,drillcore_box',
          drillcore_box__drillcore: this.drillcore,
          attachment__is_preferred: true,
          nest: 2,
        },
        fields: this.$getAPIFieldValues(HEADERS_ATTACHMENT),
      }
    )
    this.boxes = attachmentResponse.items
    this.count = attachmentResponse.count
  },
  methods: {
    boxHasInfo(box) {
      return (
        box.drillcore_box?.depth_start ||
        box.drillcore_box?.depth_end ||
        box.drillcore_box?.stratigraphy_top ||
        box.drillcore_box?.stratigraphy_base ||
        box.drillcore_box?.depth_other ||
        box.drillcore_box?.remarks
      )
    },

    handleUpdate(tableState) {
      this.options = tableState.options
      this.search = tableState.search
      this.$fetch()
    },
  },
}
</script>
