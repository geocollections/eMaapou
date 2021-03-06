<template>
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
</template>

<script>
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
          href: 'https://xgis.maaamet.ee/xgis2/page/app/maardlad',
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
        natarc: {
          title: 'natarc.title',
          description: 'natarc.description',
          href: 'https://natarc.ut.ee',
          background: 'https://picsum.photos/id/109/700/300',
          sm: 6,
          md: 2,
          lg: 2,
        },
        elurikkus: {
          title: 'elurikkus.title',
          description: 'elurikkus.description',
          href: 'https://elurikkus.ee',
          background: 'https://picsum.photos/id/120/700/300',
          sm: 6,
          md: 5,
          lg: 4,
        },
        allIds: [
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
}
</script>
