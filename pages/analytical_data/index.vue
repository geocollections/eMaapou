<template>
  <div>
    <page-title-wrapper
      :title="$t('common.analyticalDataCount')"
      :count="count"
      icon="mdi-chart-scatter-plot"
    />
    <!--    <v-row>-->
    <!--      <v-col>-->
    <!--        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam posuere,-->
    <!--        erat non interdum accumsan, felis nunc mattis justo, nec lobortis est-->
    <!--        turpis vel tortor. Donec turpis urna, pellentesque vel ipsum a, feugiat-->
    <!--        porta massa. Interdum et malesuada fames ac ante ipsum primis in-->
    <!--        faucibus. Aliquam eu aliquet tortor, vel aliquet massa. Aenean quis ante-->
    <!--        id risus porttitor suscipit. Praesent malesuada cursus tristique. Etiam-->
    <!--        dolor purus, tincidunt eu hendrerit a, dapibus eget massa. Vivamus a-->
    <!--        eros ut nisl placerat accumsan quis eu ligula. Morbi euismod maximus-->
    <!--        ipsum ut suscipit. Vivamus ac mi elementum, fringilla diam vitae, auctor-->
    <!--        dolor. Sed egestas tincidunt risus. Sed commodo, massa tincidunt posuere-->
    <!--        lacinia, risus sem varius risus, nec porttitor urna sem nec turpis.-->
    <!--        Maecenas porta risus sit amet feugiat pretium.-->
    <!--      </v-col>-->
    <!--    </v-row>-->
    <v-row>
      <v-col cols="12" md="3">
        <v-card class="pa-3">
          <analytical-data-search-form />
        </v-card>
      </v-col>
      <v-col cols="12" md="9">
        <search-view-map-wrapper :items="items" class="mb-6" />

        <analytical-data-table
          :show-search="false"
          :items="items"
          :count="count"
          :options="options"
          @update="handleUpdate"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import PageTitleWrapper from '~/components/search/PageTitleWrapper'
import SearchViewMapWrapper from '~/components/map/SearchViewMapWrapper'
import AnalyticalDataTable from '~/components/tables/AnalyticalDataTable'
import AnalyticalDataSearchForm from '~/components/search/forms/AnalyticalDataSearchForm'

export default {
  name: 'AnalysisSearch',
  components: {
    AnalyticalDataSearchForm,
    AnalyticalDataTable,
    SearchViewMapWrapper,
    PageTitleWrapper,
  },
  head() {
    return {
      title: this.$t('analyticalData.pageTitle'),
    }
  },
  computed: {
    ...mapState('landing', ['search']),
    ...mapState('analyticalData', ['items', 'count', 'options']),
  },
  methods: {
    ...mapActions('analyticalData', ['searchAnalyticalData']),
    async handleUpdate(tableState) {
      await this.searchAnalyticalData(tableState.options)
    },
  },
}
</script>
