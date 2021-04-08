<template>
  <div>
    <search-view-title
      title="common.localitiesCount"
      :count="count"
      icon="mdi-map-marker-outline"
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
          <locality-search-form />
        </v-card>
      </v-col>
      <v-col cols="12" md="9">
        <locality-table
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
import LocalitySearchForm from '@/components/search/LocalitySearchForm'
import LocalityTable from '~/components/tables/LocalityTable.vue'
import SearchViewTitle from '~/components/search/SearchViewTitle'

export default {
  components: { SearchViewTitle, LocalityTable, LocalitySearchForm },
  head() {
    return {
      title: this.$t('locality.pageTitle'),
    }
  },
  computed: {
    ...mapState('landing', ['search']),
    ...mapState('locality', ['options', 'items', 'count']),
  },
  methods: {
    ...mapActions('locality', ['searchLocalities']),
    async handleUpdate(tableState) {
      await this.searchLocalities(tableState.options)
      this.options = tableState.options
    },
  },
}
</script>
