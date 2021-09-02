<template>
  <v-hover v-slot="{ hover }">
    <v-card
      dark
      class="transition-swing"
      :class="{ 'on-hover': hover }"
      :elevation="hover ? 12 : 2"
      :href="href"
      target="_blank"
    >
      <v-img
        :src="background"
        class="white--text transition-swing d-flex align-end"
        :gradient="`to bottom, rgba(0,0,0,.3), rgba(0,0,0,${
          grayscale ? '.3' : '.3'
        })`"
        height="190px"
        content-class=""
      >
        <div style="background-color: rgba(0, 74, 99, 0.8)">
          <v-card-title
            style="word-break: keep-all"
            class="montserrat text-h6 pb-1 pt-2"
            >{{ title }}
            <v-icon right small>mdi-open-in-new</v-icon>
          </v-card-title>
          <v-card-text class="text-shadow montserrat">{{
            description
          }}</v-card-text>
        </div>
      </v-img>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  name: 'ExternalLinkCard',
  props: {
    title: {
      type: String,
      required: false,
      default: 'Title',
    },
    description: {
      type: String,
      required: false,
      default: 'Description',
    },
    href: {
      type: String,
      required: false,
      default: '',
    },
    background: {
      type: String,
      required: false,
      default: 'https://picsum.photos/700/300',
    },
    grayscale: Boolean,
  },
  computed: {
    image() {
      return `${require(this.background)}`
    },
  },
}
</script>

<style scoped>
.v-card {
  transition: opacity 0.6s ease-in-out;
}

.v-card:not(.on-hover) {
  opacity: 0.9;
}

.v-card.on-hover {
  cursor: pointer;
}

.v-card__title {
  text-shadow: black 0 0 6px;
}

.grayscale {
  -webkit-filter: grayscale(100%);
  filter: grayscale(100%);
}

.grayscale:hover {
  -webkit-filter: grayscale(0%);
  filter: grayscale(0%);
}
.text-shadow {
  text-shadow: black 0 0 6px;
}
</style>
