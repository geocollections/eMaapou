<template>
  <div>
    <v-row class="px-3 px-md-10">
      <v-col class="pt-0 px-0">
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
            class="montserrat white--text px-1 py-3"
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
            class="montserrat white--text px-1 pb-2"
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

    <!-- <v-row justify="end">
      <v-col>
        <div class="aboutpage montserrat ml-4">
          <h1 class="aboutpage my-3">Mis on e·Maapõu?</h1>
          <div>
            <p>
              <strong
                >e-Maapõu on aken Eesti geoloogiliste andmete, andmekogude ja
                e-teenuste juurde.</strong
              >
            </p>

            <p>
              Eestis toodavad ja haldavad maapõue andmeid peamiselt&nbsp;<a
                href="https://egt.ee"
                >Geoloogiateenistus</a
              >, <a href="https://maaamet.ee">Maa-amet</a>,
              <a href="https://keskkonnaamet.ee">Keskkonnaamet</a>,
              teadusasutused (<a href="https://taltech.ee/geoloogia-instituut"
                >Tallinna Tehnikaülikooli geoloogia instituut</a
              >,
              <a href="https://natmuseum.ut.ee"
                >Tartu Ülikooli loodusmuuseum ja botaanikaaed</a
              >,
              <a href="https://geoloogia.ut.ee"
                >Tartu Ülikooli geoloogia osakond</a
              >&nbsp;ja&nbsp;<a href="https://loodusmuuseum.ee"
                >Eesti Loodusmuuseum</a
              >), ning valdkonnas tegutsevad ettevõtted.&nbsp;
            </p>

            <p>
              e-Maapõu võimaldab otsida andmeid maapõue infosüsteemis SARV, mida
              kasutavad põhiliselt teadusasutused. Sellisteks andmeteks on
              näiteks geoloogilised kollektsioonid, geoloogia-alased
              publikatsioonid, puursüdamikud, paljandid,&nbsp;kivimiproovid,
              fossiilid, analüütiline andmestik, fotoarhiiv jne.
            </p>
          </div>
        </div>
        <leaflet-map site-overlay> </leaflet-map>
      </v-col>
      <v-col
        :cols="$vuetify.breakpoint.mdAndUp ? 'auto' : 12"
        :style="{ width: $vuetify.breakpoint.mdAndUp ? '400px' : '' }"
      >
        <h1 class="text-h4 mt-4 mb-3">
          {{ $t('landing.eMaapouPages') }}
        </h1>
        <div
          v-for="(item, index) in externalCards.innerIds.map(
            (id) => externalCards[id]
          )"
          :key="`inner-${index}`"
          class="pa-1"
        >
          <external-link-card
            :title="$t(item.title)"
            :description="$t(item.description)"
            :href="item.href"
            :background="item.background"
            height="95px"
          />
        </div>
        <h1 class="text-h5 grey--text text--darken-1 mt-4 mb-3">
          {{ $t('landing.otherPages') }}
        </h1>
        <div
          v-for="(item, index) in externalCards.outerIds.map(
            (id) => externalCards[id]
          )"
          :key="`outer-${index}`"
          class="pa-1"
        >
          <external-link-card
            :title="$t(item.title)"
            :description="$t(item.description)"
            :href="item.href"
            :background="item.background"
            height="95px"
            grayscale
          />
        </div>
      </v-col>
    </v-row> -->
    <v-row>
      <v-col cols="12" md="6">
        <div class="aboutpage montserrat ml-4">
          <h1 class="aboutpage text-h4 my-3 ml-3">Mis on e·Maapõu?</h1>
          <div>
            <p>
              <strong
                >e-Maapõu on aken Eesti geoloogiliste andmete, andmekogude ja
                e-teenuste juurde.</strong
              >
            </p>

            <p>
              Eestis toodavad ja haldavad maapõue andmeid peamiselt&nbsp;<a
                href="https://egt.ee"
                >Geoloogiateenistus</a
              >, <a href="https://maaamet.ee">Maa-amet</a>,
              <a href="https://keskkonnaamet.ee">Keskkonnaamet</a>,
              teadusasutused (<a href="https://taltech.ee/geoloogia-instituut"
                >Tallinna Tehnikaülikooli geoloogia instituut</a
              >,
              <a href="https://natmuseum.ut.ee"
                >Tartu Ülikooli loodusmuuseum ja botaanikaaed</a
              >,
              <a href="https://geoloogia.ut.ee"
                >Tartu Ülikooli geoloogia osakond</a
              >&nbsp;ja&nbsp;<a href="https://loodusmuuseum.ee"
                >Eesti Loodusmuuseum</a
              >), ning valdkonnas tegutsevad ettevõtted.&nbsp;
            </p>

            <p>
              e-Maapõu võimaldab otsida andmeid maapõue infosüsteemis SARV, mida
              kasutavad põhiliselt teadusasutused. Sellisteks andmeteks on
              näiteks geoloogilised kollektsioonid, geoloogia-alased
              publikatsioonid, puursüdamikud, paljandid,&nbsp;kivimiproovid,
              fossiilid, analüütiline andmestik, fotoarhiiv jne.
            </p>
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="6">
        <leaflet-map
          class="mt-4 rounded elevation-3"
          :height="650"
          summary-overlay
          :zoom="7"
          rounded
          :show-links="false"
        />
      </v-col>
    </v-row>
    <v-row class="my-6" justify="center" align="center">
      <v-col cols="12">
        <h1 class="text-h4 ml-3">
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
          localeName: 'analytical_data',
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
    ...mapFields('landing', ['search']),
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
