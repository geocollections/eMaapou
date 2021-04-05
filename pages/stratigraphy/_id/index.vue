<template>
  <stratigraphy-reference-table
    :items="items"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { mapState } from 'vuex'
import { debounce, isNil } from 'lodash'
import { STRATIGRAPHY_REFERENCE } from '~/constants'
import StratigraphyReferenceTable from '~/components/tables/StratigraphyReferenceTable'

export default {
  components: { StratigraphyReferenceTable },
  props: {
    stratigraphy: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      options: STRATIGRAPHY_REFERENCE.options,
      items: [],
      count: 0,
    }
  },
  computed: {
    ...mapState('landing', ['search']),
  },
  watch: {
    search: {
      handler: debounce(function (value) {
        this.options.page = 1
        this.handleUpdate({ tableOptions: { ...this.options }, search: value })
      }, 500),
    },
  },
  methods: {
    async handleUpdate(options) {
      const referenceResponse = await this.$services.sarvREST.getResourceList(
        'stratigraphy_reference',
        {
          ...options,
          isValid: isNil(this.stratigraphy),
          defaultParams: {
            stratigraphy: this.stratigraphy,
          },
          queryFields: this.$getQueryFields(STRATIGRAPHY_REFERENCE.queryFields),
        }
      )

      this.items = referenceResponse.items
      this.count = referenceResponse.count
    },
  },
}
</script>
