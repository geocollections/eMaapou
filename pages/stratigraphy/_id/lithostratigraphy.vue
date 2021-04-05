<template>
  <stratigraphy-table
    :items="items"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { mapState } from 'vuex'
import { debounce, isNil } from 'lodash'
import { STRATIGRAPHY } from '~/constants'
import StratigraphyTable from '~/components/tables/StratigraphyTable'

export default {
  components: { StratigraphyTable },
  props: {
    stratigraphy: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      options: STRATIGRAPHY.options,
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
      const analysisResponse = await this.$services.sarvSolr.getResourceList(
        'stratigraphy',
        {
          ...options,
          isValid: isNil(this.stratigraphy),
          defaultParams: {
            fq: `age_chronostratigraphy:${this.stratigraphy}`,
          },
          queryFields: this.$getQueryFields(STRATIGRAPHY.queryFields),
        }
      )
      this.items = analysisResponse.items
      this.count = analysisResponse.count
    },
  },
}
</script>
