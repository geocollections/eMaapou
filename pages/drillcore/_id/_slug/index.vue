<template>
  <list-drillcore-box
    :options="options"
    :count="count"
    :items="boxes"
    @update="handleUpdate"
  />
</template>

<script>
import { HEADERS_ATTACHMENT } from '~/constants'
import ListDrillcoreBox from '~/components/list/ListDrillcoreBox.vue'
export default {
  components: { ListDrillcoreBox },
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
    }
  },
  fetch() {
    this.handleUpdate({ options: this.options, search: '' })
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
    async handleUpdate(tableState) {
      this.options = tableState.options
      const attachmentResponse = await this.$services.sarvREST.getResourceList(
        'attachment_link',
        {
          ...tableState,
          defaultParams: {
            ordering: 'drillcore_box__depth_start,drillcore_box',
            drillcore_box__drillcore: this.$route.params.id,
            attachment__is_preferred: true,
            nest: 2,
          },
          fields: this.$getAPIFieldValues(HEADERS_ATTACHMENT),
        }
      )
      this.boxes = attachmentResponse.items
      this.count = attachmentResponse.count
    },
  },
}
</script>
