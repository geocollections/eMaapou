<template>
  <div>
    <v-row class="px-3 px-md-10">
      <v-col class="px-0 pt-0">
        <!-- <v-tabs
          v-if="$vuetify.breakpoint.smAndUp"
          :value="tabValue"
          align-with-title
          optional
          height="auto"
          background-color="transparent"
          show-arrows
          center-active
          light
          centered
        >
          <v-tab
            v-for="(item, index) in tabs"
            :key="`tab-${index}`"
            class="px-1 py-3 montserrat white--text"
          >
            <search-card
              class="mx-1 my-1 text--h6"
              :title="$t(`common.${item.title}`)"
              :card-class="item.class"
              :href="item.name"
            ></search-card>
          </v-tab>
        </v-tabs> -->
        <div
          class="pt-3"
          :class="{
            'd-flex flex-wrap justify-center': $vuetify.breakpoint.smAndUp,
          }"
        >
          <div
            v-for="(item, index) in searchCards"
            :key="`tab-mobile-${index}`"
            class="px-1 pb-2 montserrat white--text"
          >
            <search-card
              class="text--h6"
              height="60px"
              :title="item.title"
              :card-class="item.class"
              :to="localePath({ name: item.localeName })"
            ></search-card>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <h1 class="my-3 text-h4">{{ $t('about.title') }}</h1>
        <div
          class="aboutpage montserrat"
          v-html="$translate({ et: page.content_et, en: page.content_en })"
        ></div>
      </v-col>
      <v-col cols="12" md="6">
        <h1 class="my-3 text-h4">{{ $t('landing.map') }}</h1>
        <leaflet-map
          class="mt-4 rounded elevation-3"
          :height="750"
          summary-overlay
          :zoom="6"
          rounded
          :show-links="false"
        />
      </v-col>
    </v-row>
    <v-row class="my-6" justify="center" align="center">
      <v-col cols="12">
        <h1 class="text-h4">
          {{ $t('landing.otherPages') }}
        </h1>
      </v-col>
      <v-col
        v-for="(item, index) in externalCards.ids.map(
          (id) => externalCards[id]
        )"
        :key="`inner-${index}`"
        class="pa-1"
        cols="12"
        :sm="item.sm || 6"
        :md="item.md || 6"
      >
        <external-link-card
          :title="$t(item.title)"
          :description="$t(item.description)"
          :href="item.href"
          :background="item.background"
          grayscale
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import { isEmpty } from 'lodash'
import ExternalLinkCard from '~/components/ExternalLinkCard.vue'
import SearchCard from '~/components/SearchCard.vue'
import LeafletMap from '~/components/map/LeafletMap.vue'
export default {
  components: {
    ExternalLinkCard,
    SearchCard,
    LeafletMap,
  },
  async asyncData({ route, error, app }) {
    const data = await app.$services.sarvREST.getResource('page', 78)
    return { page: data.results[0] }
  },
  data() {
    return {
      searchCards: [
        {
          localeName: 'locality',
          title: this.$t('common.localities'),
          class: 'locality-search-card',
        },
        {
          localeName: 'site',
          title: this.$t('common.sites'),
          class: 'site-search-card',
        },
        {
          localeName: 'drillcore',
          title: this.$t('common.drillcores'),
          class: 'drillcore-search-card',
        },
        {
          localeName: 'sample',
          title: this.$t('common.samples'),
          class: 'sample-search-card',
        },
        {
          localeName: 'analytical-data',
          title: this.$t('common.analyticalData'),
          class: 'analysis-search-card',
        },
        {
          localeName: 'dataset',
          title: this.$t('common.datasets'),
          class: 'dataset-search-card',
        },
        {
          localeName: 'taxon',
          title: this.$t('common.taxa'),
          class: 'search-card',
        },
        {
          localeName: 'photo',
          title: this.$t('common.photo'),
          class: 'photo-search-card',
        },
        {
          localeName: 'analysis',
          title: this.$t('common.analyses'),
          class: 'analysis-search-card',
        },
        {
          localeName: 'stratigraphy',
          title: this.$t('common.stratigraphy'),
          class: 'stratigraphy-search-card',
        },
      ],
      externalCards: {
        geocollections: {
          title: 'geocollections.title',
          description: 'geocollections.description',
          href: 'https://geocollections.info',
          background: require('~/assets/frontpage/geokogud.jpg'),
          sm: 6,
          md: 4,
          lg: 4,
        },
        kirjandus: {
          title: 'kirjandus.title',
          description: 'kirjandus.description',
          href: 'https://kirjandus.geoloogia.info',
          background: require('~/assets/frontpage/geokirjandus.jpg'),
          sm: 6,
          md: 4,
          lg: 4,
        },
        gmre: {
          title: 'gmre.title',
          description: 'gmre.description',
          href: 'https://geoloogia.info/geology',
          background: require('~/assets/frontpage/gmre.jpg'),
          sm: 6,
          md: 3,
          lg: 3,
        },
        fond: {
          title: 'fond.title',
          description: 'fond.description',
          href: 'https://fond.egt.ee',
          background: require('~/assets/frontpage/geoloogiafond.jpg'),
          sm: 6,
          md: 4,
          lg: 4,
        },
        // Divider
        fossiilid: {
          title: 'fossiilid.title',
          description: 'fossiilid.description',
          href: 'https://fossiilid.info',
          background: require('~/assets/frontpage/fossiilid.jpg'),
          sm: 6,
          md: 4,
          lg: 4,
        },
        kivid: {
          title: 'kivid.title',
          description: 'kivid.description',
          href: 'https://kivid.info',
          background: require('~/assets/frontpage/kivid.jpg'),
          sm: 6,
          md: 4,
          lg: 4,
        },
        stratigraphy: {
          title: 'frontStratigraphy.title',
          description: 'frontStratigraphy.description',
          href: 'https://stratotuup.ut.ee',
          background: require('~/assets/frontpage/stratigraafia.jpg'),
          sm: 6,
          md: 4,
          lg: 4,
        },
        // Divider
        maardlad: {
          title: 'maardlad.title',
          description: 'maardlad.description',
          href:
            'https://geoportaal.maaamet.ee/est/Ruumiandmed/Geoloogilised-andmed-p115.html',
          background: require('~/assets/frontpage/maardlad.jpg'),
          sm: 6,
          md: 4,
          lg: 4,
        },
        doi: {
          title: 'doi.title',
          description: 'doi.description',
          href: 'https://doi.geocollections.info',
          background: require('~/assets/frontpage/sarv-doi.jpg'),
          sm: 6,
          md: 4,
          lg: 4,
        },
        turba: {
          title: 'turba.title',
          description: 'turba.description',
          href: 'https://turba.geoloogia.info',
          background: require('~/assets/frontpage/turba.jpg'),
          sm: 6,
          md: 3,
          lg: 3,
        },
        // Divider
        geocase: {
          title: 'geocase.title',
          description: 'geocase.description',
          href: 'https://geocase.eu',
          background: require('~/assets/frontpage/geocase.jpg'),
          sm: 6,
          md: 3,
          lg: 3,
        },
        eurocore: {
          title: 'eurocore.title',
          description: 'eurocore.description',
          href: 'https://eurocore.rocks',
          background: require('~/assets/frontpage/eurocore.jpg'),
          sm: 6,
          md: 3,
          lg: 3,
        },
        sarv: {
          title: 'sarv.title',
          description: 'sarv.description',
          href: 'https://edit.geocollections.info',
          background: require('~/assets/frontpage/sarv-wb.jpg'),
          sm: 6,
          md: 4,
          lg: 4,
        },
        ids: [
          'kirjandus',
          'doi',
          'geocollections',
          'fossiilid',
          'kivid',
          'sarv',
          'fond',
          'maardlad',
          'stratigraphy',
          'gmre',
          'turba',
          'geocase',
          'eurocore',
        ],
        innerIds: [
          'kirjandus',
          'doi',
          'geocollections',
          'fossiilid',
          'kivid',
          'sarv',
        ],
        outerIds: [
          'fond',
          'maardlad',
          'stratigraphy',
          'gmre',
          'turba',
          'geocase',
          'eurocore',
        ],
      },
    }
  },
  head() {
    return {
      title: this.$t('landing.title'),
    }
  },
  computed: {
    ...mapFields('search', ['searchQuery']),
    tabValue() {
      // https://github.com/vuetifyjs/vuetify/issues/12265
      const path = this.$route.path
      const full = this.$route.fullPath
      return path[path.length - 1] !== '/'
        ? `${path}/${full.substring(path.length)}`
        : `${full}/`
    },
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
