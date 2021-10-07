<template>
  <v-card
    style="background-color: rgba(0, 119, 154, 0.9)"
    :height="
      $vuetify.breakpoint.xsOnly ||
      ($vuetify.breakpoint.smAndUp && $vuetify.breakpoint.height < 400)
        ? 'auto'
        : 'auto'
    "
    class="pt-0 pt-sm-0"
    outlines
    elevation="15"
  >
    <v-row no-gutters>
      <!-- QUICK SEARCH -->
      <v-col>
        <div class="d-flex flex-column justify-start fill-height">
          <div class="my-4 my-sm-7 my-md-12">
            <v-card-title
              style="word-break: break-word"
              :class="{
                'font-small montserrat': $vuetify.breakpoint.smAndDown,
              }"
              class="mx-3 mb-4 pa-0 px-sm-2 text-h5 text-sm-h4 white--text"
            >
              {{ $t('landing.quickSearch') }}
            </v-card-title>
            <v-card-actions class="mx-3 mx-sm-5 pa-0">
              <quick-search-form
                style="width: 100%"
                :only-icon="$vuetify.breakpoint.smAndDown"
                @submit="handleSearch"
              />
            </v-card-actions>
          </div>
          <!-- MAP BUTTON -->
          <div v-if="renderSideCard" class="text-right">
            <v-btn
              :ripple="false"
              plain
              dark
              class="montserrat py-6"
              @click="$emit('toggle:side')"
            >
              {{ showMap ? $t('common.closeMap') : $t('common.openMap') }}

              <v-icon>{{ 'mdi-chevron-right' }}</v-icon>
            </v-btn>
          </div>

          <v-divider class="white mx-2 mx-sm-5"></v-divider>
          <!-- DETAIL SEARCH CHIPS -->
          <div class="my-4 my-sm-7 my-md-12">
            <v-card-title
              style="word-break: break-word"
              :class="{
                'font-small montserrat': $vuetify.breakpoint.smAndDown,
              }"
              class="mx-3 mb-4 pa-0 px-sm-2 text-h5 text-sm-h4 white--text"
            >
              {{ $t('landing.viewMore') }}
            </v-card-title>
            <div class="mx-3 mx-sm-5 mt-2 d-flex flex-wrap">
              <div
                v-for="(route, index) in searchRoutes"
                :key="`tab-mobile-${index}`"
                class="px-1 pb-2 white--text"
              >
                <search-card
                  class="text--h6"
                  height="50px"
                  :title="$t(route.text)"
                  :card-class="route.class"
                  :to="localePath({ name: route.routeName })"
                ></search-card>
              </div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { isEmpty } from 'lodash'
import SearchCard from '~/components/SearchCard.vue'
import QuickSearchForm from '~/components/search/forms/QuickSearchForm.vue'
export default {
  name: 'TheSearchCard',
  components: {
    SearchCard,
    QuickSearchForm,
  },
  props: {
    showMap: {
      type: Boolean,
      require: true,
    },
    renderSideCard: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      searchRoutes: [
        {
          routeName: 'locality',
          text: 'locality.pageTitle',
          class: 'locality-search-card',
        },
        {
          routeName: 'site',
          text: 'site.pageTitle',
          class: 'site-search-card',
        },
        {
          routeName: 'drillcore',
          text: 'drillcore.pageTitle',
          class: 'drillcore-search-card',
        },
        {
          routeName: 'sample',
          text: 'sample.pageTitle',
          class: 'sample-search-card',
        },
        {
          routeName: 'analytical-data',
          text: 'analyticalData.pageTitle',
          class: 'analysis-search-card',
        },
        {
          routeName: 'dataset',
          text: 'dataset.pageTitle',
          class: 'dataset-search-card',
        },
        {
          routeName: 'taxon',
          text: 'taxon.pageTitle',
          class: 'search-card',
        },
        {
          routeName: 'photo',
          text: 'photo.pageTitle',
          class: 'photo-search-card',
        },
        {
          routeName: 'analysis',
          text: 'analysis.pageTitle',
          class: 'analysis-search-card',
        },
        {
          routeName: 'stratigraphy',
          text: 'stratigraphy.pageTitle',
          class: 'stratigraphy-search-card',
        },
        {
          routeName: 'specimen',
          text: 'specimen.pageTitle',
          class: 'specimen-search-card',
        },
        {
          routeName: 'preparation',
          text: 'preparation.pageTitle',
          class: 'search-card',
        },
      ],
    }
  },
  methods: {
    handleSearch() {
      const routeName = this.$route.name.includes('search')
        ? this.$route.name.split('__')[0]
        : 'search'
      const query = isEmpty(this.search)
        ? { ...this.$route.query }
        : { ...this.$route.query, q: this.search }
      this.$router.push(this.localePath({ name: routeName, query }))
    },
  },
}
</script>
