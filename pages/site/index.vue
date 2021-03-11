<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <h1 class="text-center">{{ $t('common.sites') }}</h1>
      </v-col>
    </v-row>
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
      <v-col cols="3">
        <v-card class="pa-3">
          <site-search-form />
        </v-card>
      </v-col>
      <v-col cols="9">
        <table-wrapper
          :show-search="false"
          :items="items"
          :headers="translatedHeaders"
          :count="count"
          :init-options="options"
          @update="handleUpdate"
        >
          <template #item.id="{ item }">
            <nuxt-link
              class="text-link"
              :to="localePath({ name: 'site-id', params: { id: item.id } })"
            >
              {{ item.id }}
            </nuxt-link>
          </template>
        </table-wrapper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableWrapper from '@/components/tables/TableWrapper'
import SiteSearchForm from '@/components/search/SiteSearchForm'

export default {
  components: { TableWrapper, SiteSearchForm },
  head() {
    return {
      title: this.$t('site.pageTitle'),
    }
  },
  computed: {
    ...mapState('landing', ['search']),
    ...mapState('site', ['options', 'items', 'count', 'headers']),
    translatedHeaders() {
      return this.headers.map((header) => {
        return {
          ...header,
          text: this.$t(header.text),
        }
      })
    },
  },
  methods: {
    ...mapActions('site', ['searchSites']),
    async handleUpdate(options) {
      await this.searchSites(options.tableOptions)
    },
  },
}
</script>
