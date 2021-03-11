<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <h1 class="text-center">{{ $t('common.localities') }}</h1>
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
      <v-col cols="12" md="3">
        <v-card class="pa-3">
          <locality-search-form />
        </v-card>
      </v-col>
      <v-col cols="12" md="9">
        <table-wrapper
          external-options
          :show-search="false"
          :items="items"
          :headers="translatedHeaders"
          :count="count"
          :init-options="options"
          @update="handleUpdate"
        >
          <template #item.locality="{ item }">
            <nuxt-link
              class="text-link"
              :to="localePath({ name: 'locality-id', params: { id: item.id } })"
            >
              {{ $translate({ et: item.locality, en: item.locality_en }) }}
            </nuxt-link>
          </template>
          <template #item.country="{ item }">
            {{ $translate({ et: item.country, en: item.country_en }) }}
          </template>
        </table-wrapper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableWrapper from '@/components/tables/TableWrapper'
import LocalitySearchForm from '@/components/search/LocalitySearchForm'

export default {
  components: { TableWrapper, LocalitySearchForm },
  head() {
    return {
      title: this.$t('locality.pageTitle'),
    }
  },
  computed: {
    ...mapState('landing', ['search']),
    ...mapState('locality', ['options', 'items', 'count', 'headers']),
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
    ...mapActions('locality', ['searchLocalities']),

    async handleUpdate(options) {
      await this.searchLocalities(options.tableOptions)
    },
  },
}
</script>
