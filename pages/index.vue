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
          background:
            'https://files.geocollections.info/img/geocollections-front/specimen.jpg',
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
          md: 6,
          lg: 6,
        },
        fond: {
          title: 'fond.title',
          description: 'fond.description',
          href: 'https://fond.egt.ee',
          background: 'https://picsum.photos/id/32/700/300',
          sm: 6,
          md: 4,
          lg: 4,
        },
        // Divider
        fossiilid: {
          title: 'fossiilid.title',
          description: 'fossiilid.description',
          href: 'https://fossiilid.info',
          background:
            'https://files.geocollections.info/img/geocollections-front/fossil.jpg',
          sm: 6,
          md: 3,
          lg: 3,
        },
        kivid: {
          title: 'kivid.title',
          description: 'kivid.description',
          href: 'https://kivid.info',
          background:
            'https://files.geocollections.info/img/geocollections-front/rock.jpg',
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
          background:
            'https://files.geocollections.info/medium/c3/3b/c33b841e-c7d8-4951-bd9a-3cdc18e4e343.jpg',
          sm: 6,
          md: 4,
          lg: 4,
        },
        doi: {
          title: 'doi.title',
          description: 'doi.description',
          href: 'https://doi.geocollections.info',
          background: 'https://files.geocollections.info/img/doi/header.jpg',
          sm: 6,
          md: 3,
          lg: 3,
        },
        turba: {
          title: 'turba.title',
          description: 'turba.description',
          href: 'https://turba.geoloogia.info',
          background:
            'https://files.geocollections.info/medium/c1/77/c1777c75-0310-4560-9690-1222f9f3156b.jpg',
          sm: 6,
          md: 3,
          lg: 3,
        },
        // Divider
        geocase: {
          title: 'geocase.title',
          description: 'geocase.description',
          href: 'https://geocase.eu',
          background:
            'https://files.geocollections.info/img/geocase/front_page/mineral1.jpg',
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
          'doi',
          'fond',
          'maardlad',
          'stratigraphy',
          'fossiilid',
          'kivid',
          'turba',
          'geocase',
          'natarc',
          'eurocore',
          /* 'elurikkus', */
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
