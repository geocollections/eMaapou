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
          background: 'https://picsum.photos/id/10/700/300',
          sm: 12,
          md: 4,
          lg: 4,
        },
        kirjandus: {
          title: 'kirjandus.title',
          description: 'kirjandus.description',
          href: 'https://geoloogia.info',
          background: 'https://picsum.photos/id/21/700/300',
          sm: 12,
          md: 4,
          lg: 4,
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
          background: 'https://picsum.photos/id/43/700/300',
          sm: 6,
          md: 5,
          lg: 4,
        },
        kivid: {
          title: 'kivid.title',
          description: 'kivid.description',
          href: 'https://kivid.info',
          background: 'https://picsum.photos/id/43/700/300',
          sm: 12,
          md: 3,
          lg: 4,
        },
        stratigraphy: {
          title: 'stratigraphy.title',
          description: 'stratigraphy.description',
          href: 'https://stratigraphy.info',
          background: 'https://picsum.photos/id/54/700/300',
          sm: 6,
          md: 4,
          lg: 4,
        },
        // Divider
        maardlad: {
          title: 'maardlad.title',
          description: 'maardlad.description',
          href: 'https://xgis.maaamet.ee/xgis2/page/app/maardlad',
          background: 'https://picsum.photos/id/65/700/300',
          sm: 6,
          md: 3,
          lg: 4,
        },
        turba: {
          title: 'turba.title',
          description: 'turba.description',
          href: 'https://turba.geoloogia.info',
          background: 'https://picsum.photos/id/76/700/300',
          sm: 6,
          md: 6,
          lg: 4,
        },
        doi: {
          title: 'doi.title',
          description: 'doi.description',
          href: 'https://doi.geocollections.info',
          background: 'https://picsum.photos/id/87/700/300',
          sm: 6,
          md: 3,
          lg: 4,
        },
        // Divider
        geocase: {
          title: 'geocase.title',
          description: 'geocase.description',
          href: 'https://geocase.eu',
          background: 'https://picsum.photos/id/98/700/300',
          sm: 12,
          md: 4,
          lg: 4,
        },
        natarc: {
          title: 'natarc.title',
          description: 'natarc.description',
          href: 'https://natarc.ut.ee',
          background: 'https://picsum.photos/id/109/700/300',
          sm: 6,
          md: 3,
          lg: 4,
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
          'fond',
          'fossiilid',
          'kivid',
          'stratigraphy',
          'maardlad',
          'turba',
          'doi',
          'geocase',
          'natarc',
          'elurikkus',
        ],
      },
    }
  },
}
</script>
