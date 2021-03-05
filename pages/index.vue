<template>
  <v-row class="my-6" justify="center" align="center">
    <v-col
      v-for="(item, index) in cards.allIds"
      :key="index"
      class="pa-3"
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
        card0: {
          title: 'geocollections.title',
          description: 'geocollections.description',
          href: 'https://geocollections.info',
          background: 'https://picsum.photos/id/10/700/300',
          sm: 12,
          md: 6,
        },
        card1: {
          title: 'kirjandus.title',
          description: 'kirjandus.description',
          href: 'https://geoloogia.info',
          background: 'https://picsum.photos/id/21/700/300',
          sm: 12,
          md: 6,
        },
        card2: {
          title: 'ema.title',
          description: 'ema.description',
          href: 'https://ema.geoloogia.info',
          background: 'https://picsum.photos/id/32/700/300',
          sm: 6,
          md: 4,
        },
        card3: {
          title: 'geocase.title',
          description: 'geocase.description',
          href: 'https://turba.geoloogia.info',
          background: 'https://picsum.photos/id/43/700/300',
          sm: 6,
          md: 4,
        },
        card4: {
          title: 'turba.title',
          description: 'turba.description',
          href: 'link',
          background: 'https://picsum.photos/id/54/700/300',
          sm: 12,
          md: 4,
        },
        card5: {
          title: 'placeholder.title',
          description: 'placeholder.description',
          href: 'link',
          background: 'https://picsum.photos/id/65/700/300',
          sm: 6,
          md: 3,
        },
        card6: {
          title: 'placeholder.title',
          description: 'placeholder.description',
          href: 'link',
          background: 'https://picsum.photos/id/76/700/300',
          sm: 6,
          md: 6,
        },
        card7: {
          title: 'placeholder.title',
          description: 'placeholder.description',
          href: 'link',
          background: 'https://picsum.photos/id/87/700/300',
          sm: 12,
          md: 3,
        },
        allIds: [
          'card0',
          'card1',
          'card2',
          'card3',
          'card4',
          'card5',
          'card6',
          'card7',
        ],
      },
    }
  },
}
</script>
