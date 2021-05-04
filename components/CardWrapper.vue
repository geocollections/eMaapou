<template>
  <v-hover v-slot="{ hover }">
    <v-card
      dark
      shaped
      class="transition-swing"
      :class="{ 'on-hover': hover }"
      :elevation="hover ? 12 : 2"
      :href="!innerLink ? link : ''"
      :target="!innerLink ? '_blank' : ''"
      :nuxt="innerLink"
      @click="innerLink ? $router.push(localePath({ name: link })) : ''"
    >
      <v-img
        :src="background"
        class="white--text align-end transition-swing"
        :class="{ grayscale: grayscale }"
        :gradient="`to bottom, rgba(0,0,0,.2), rgba(0,0,0,${
          grayscale ? '.8' : '.6'
        })`"
        height="200px"
        content-class="my-auto"
      >
        <v-card-title
          style="word-break: keep-all"
          class="justify-center text-center text-shadow font-weight-bold text-uppercase"
          >{{ $t(title) }}</v-card-title
        >
        <v-card-text class="text-body-1 text-center text-shadow">{{
          $t(description)
        }}</v-card-text>
        <v-card-actions class="justify-center mb-2">
          <v-btn
            outlined
            class="rounded-tr-lg rounded-bl-lg"
            small
            :target="!innerLink ? '_blank' : ''"
            :nuxt="innerLink"
            @click="innerLink ? $router.push(localePath({ name: link })) : ''"
            >{{ $t('landing.visit_site') }}
            <v-icon right small>mdi-open-in-new</v-icon>
          </v-btn>
        </v-card-actions>
      </v-img>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  name: 'CardWrapper',
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
    link: {
      type: String,
      required: false,
      default: 'Link',
    },
    background: {
      type: String,
      required: false,
      default: 'https://picsum.photos/700/300',
    },
    innerLink: Boolean,
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
