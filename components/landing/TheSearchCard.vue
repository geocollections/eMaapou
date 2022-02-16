<template>
  <v-card
    style="background-color: rgba(87, 125, 175, 0.8)"
    :height="
      $vuetify.breakpoint.xsOnly ||
      ($vuetify.breakpoint.smAndUp && $vuetify.breakpoint.height < 400)
        ? 'auto'
        : 'auto'
    "
    class="pt-0 pt-sm-0"
    outlines
    elevation="5"
  >
    <v-row no-gutters>
      <!-- QUICK SEARCH -->
      <v-col>
        <div class="d-flex flex-column justify-start fill-height">
          <div class="my-4 my-sm-4 my-md-6">
            <v-card-title
              style="word-break: break-word"
              :class="{
                'font-small montserrat': $vuetify.breakpoint.smAndDown,
              }"
              class="mx-3 mb-4 pa-0 px-sm-2 text-sm-h5 white--text"
            >
              {{ $t('landing.quickSearch') }}
            </v-card-title>
            <v-card-actions class="mx-3 mx-sm-5 pa-0">
              <search-from-quick
                style="width: 100%"
                :only-icon="$vuetify.breakpoint.smAndDown"
                @submit="handleSearch"
              />
            </v-card-actions>
          </div>
          <!-- Text -->
          <div class="hidden-md-and-down my-2 white--text">
            <div class="mx-3 mx-sm-5 mt-2 d-flex flex-wrap">
              <p>
                {{ $t('landing.intro') }}
              </p>
            </div>
          </div>
          <!-- DETAIL SEARCH CHIPS -->
          <div class="my-4 my-sm-4 my-md-6">
            <div class="mx-3 mx-sm-5 mt-2 d-flex flex-wrap">
              <div
                v-for="(route, index) in searchRoutes"
                :key="`tab-mobile-${index}`"
                class="px-1 pb-2 white--text"
              >
                <base-chip-link
                  height="50px"
                  :title="$t(route.text)"
                  :card-class="route.class"
                  :to="localePath({ name: route.routeName })"
                ></base-chip-link>
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
import BaseChipLink from '~/components/base/BaseChipLink.vue'
import SearchFromQuick from '~/components/search/forms/SearchFormQuick.vue'
export default {
  name: 'TheSearchCard',
  components: {
    BaseChipLink,
    SearchFromQuick,
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
        },
        {
          routeName: 'drillcore',
          text: 'drillcore.pageTitle',
        },
        {
          routeName: 'area',
          text: 'area.pageTitle',
        },
        {
          routeName: 'site',
          text: 'site.pageTitle',
        },
        {
          routeName: 'sample',
          text: 'sample.pageTitle',
        },
        {
          routeName: 'dataset',
          text: 'dataset.pageTitle',
        },
        {
          routeName: 'analysis',
          text: 'analysis.pageTitle',
        },
        {
          routeName: 'analytical-data',
          text: 'analyticalData.pageTitle',
        },
        {
          routeName: 'photo',
          text: 'photo.pageTitle',
        },
        {
          routeName: 'taxon',
          text: 'taxon.pageTitle',
        },
        {
          routeName: 'stratigraphy',
          text: 'stratigraphy.pageTitle',
        },
        {
          routeName: 'specimen',
          text: 'specimen.pageTitle',
        },
        {
          routeName: 'preparation',
          text: 'preparation.pageTitle',
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
