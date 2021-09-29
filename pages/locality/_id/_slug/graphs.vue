<template>
  <div>
    <scatter-chart
      v-if="analysisResultsCount > 0"
      table-key="locality_id"
      :table-id="$route.params.id.toString()"
      :chart-title="chartTitle"
    />

    <las-chart
      v-if="attachment && lasContent"
      class="pa-2"
      :class="{ 'pt-4': analysisResultsCount === 0 }"
      :hide-renderer-switch="analysisResultsCount > 0"
      :chart-title="chartTitle"
      :file-data="lasContent"
    />
  </div>
</template>

<script>
import ScatterChart from '~/components/chart/ScatterChart'
import LasChart from '~/components/chart/LasChart'

export default {
  components: { LasChart, ScatterChart },
  props: {
    localityObject: {
      type: Object,
      default: () => {},
    },
    attachment: {
      type: String,
      required: false,
      default: '',
    },
    analysisResultsCount: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  data() {
    return {
      lasContent: null,
    }
  },
  async fetch() {
    let rawLasFileContent
    if (this.attachment) {
      const rawLasfileContentResponse =
        await this.$services.sarvREST.getResource('file', this.attachment, {
          params: {
            raw_content: 'true',
          },
        })

      rawLasFileContent = rawLasfileContentResponse
      if (
        typeof rawLasfileContentResponse === 'string' &&
        rawLasFileContent.startsWith('Error: ')
      )
        rawLasFileContent = ''
      this.lasContent = rawLasFileContent
    }
  },
  computed: {
    chartTitle() {
      return this.$translate({
        et: this?.localityObject?.locality,
        en: this?.localityObject?.locality_en,
      })
    },
  },
}
</script>
