<template>
  <div>
    <v-row justify="center" align="center">
      <v-col>
        <h1 class="text-center">
          {{ $t('landing.searchTitle') }}
        </h1>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col sm="7" md="5">
        <v-text-field
          v-model="search"
          dense
          outlined
          single-line
          :autofocus="true"
          color="deep-orange darken-2"
          append-icon="mdi-magnify"
          :label="$t('common.searchAlt')"
          hide-details
          clearable
          @click:append="handleSearch"
          @keyup.enter="handleSearch"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-col>
        <h2 class="text-center grey--text text--darken-1">
          {{ $t('landing.otherPages') }}
        </h2>
      </v-col>
    </v-row>
    <v-row class="my-6" justify="center" align="center">
      <v-col
        v-for="(item, index) in cards.allIds"
        :key="index"
        class="pa-2"
        cols="12"
        :sm="cards[item].sm || 6"
        :md="cards[item].md || 6"
      >
        <card-wrapper
          :title="cards[item].title"
          :description="cards[item].description"
          :link="cards[item].href"
          :background="cards[item].background"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import { isEmpty } from 'lodash'
import CardWrapper from '~/components/CardWrapper'
export default {
  components: { CardWrapper },
  data() {
    return {
      cards: {
        geocollections: {
          title: 'geocollections.title',
          description: 'geocollections.description',
          href: 'https://geocollections.info',
          background: require('~/assets/frontpage/geokogud.jpg'),
          sm: 6,
          md: 3,
          lg: 3,
        },
        kirjandus: {
          title: 'kirjandus.title',
          description: 'kirjandus.description',
          href: 'https://geoloogia.info',
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
          md: 2,
          lg: 2,
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
          md: 3,
          lg: 3,
        },
        kivid: {
          title: 'kivid.title',
          description: 'kivid.description',
          href: 'https://kivid.info',
          background: require('~/assets/frontpage/kivid.jpg'),
          sm: 6,
          md: 6,
          lg: 6,
        },
        stratigraphy: {
          title: 'stratigraphy.title',
          description: 'stratigraphy.description',
          href: 'http://stratigraafia.info',
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
          md: 3,
          lg: 3,
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
          md: 5,
          lg: 5,
        },
        eurocore: {
          title: 'eurocore.title',
          description: 'eurocore.description',
          href: 'https://eurocore.rocks',
          background: require('~/assets/frontpage/eurocore.jpg'),
          sm: 6,
          md: 5,
          lg: 5,
        },
        sarv: {
          title: 'sarv.title',
          description: 'sarv.description',
          href: 'https://edit.geocollections.info',
          background: require('~/assets/frontpage/sarv-wb.jpg'),
          sm: 6,
          md: 2,
          lg: 2,
        },
        ema: {
          title: 'ema.title',
          description: 'ema.description',
          href: 'https://geoloogia.info',
          background: require('~/assets/header/header1a.jpg'),
          sm: 12,
          md: 12,
          lg: 12,
        },
        drillcores: {
          title: 'Drillcores',
          description: 'Drillcores',
          href: 'https://geoloogia.info/drillcore',
          background: require('~/assets/frontpage/sarv-wb.jpg'),
          sm: 4,
          md: 3,
          lg: 3,
        },
        localities: {
          title: 'Localities',
          description: 'Localities',
          href: 'https://geoloogia.info/drillcore',
          background: require('~/assets/frontpage/sarv-wb.jpg'),
          sm: 4,
          md: 3,
          lg: 3,
        },
        samples: {
          title: 'Samples',
          description: 'Samples',
          href: 'https://geoloogia.info/drillcore',
          background: require('~/assets/frontpage/sarv-wb.jpg'),
          sm: 4,
          md: 3,
          lg: 3,
        },
        analyses: {
          title: 'Analyses',
          description: 'Analyses',
          href: 'https://geoloogia.info/drillcore',
          background: require('~/assets/frontpage/sarv-wb.jpg'),
          sm: 4,
          md: 3,
          lg: 3,
        },
        allIds: [
          // 'ema',
          // 'localities',
          // 'drillcores',
          // 'samples',
          // 'analyses',
          'geocollections',
          'kirjandus',
          'gmre',
          'doi',
          'fond',
          'stratigraphy',
          'maardlad',
          'fossiilid',
          'kivid',
          'turba',
          'geocase',
          'eurocore',
          'sarv',
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
