<template>
  <v-hover v-slot="{ hover }">
    <v-card
      dark
      shaped
      ripple
      :class="{ 'on-hover': hover }"
      :elevation="hover ? 6 : 2"
    >
      <v-img
        :src="background"
        class="white--text align-end"
        gradient="to bottom, rgba(0,0,0,.2), rgba(0,0,0,.6)"
        height="200px"
      >
        <v-card-title
          class="justify-center text-no-wrap text-shadow font-weight-bold text-uppercase"
          >{{ $t(title) }}</v-card-title
        >
        <v-card-text class="text-body-1 text-center text-shadow">{{
          $t(description)
        }}</v-card-text>
        <v-card-actions class="justify-center mb-2">
          <v-btn
            outlined
            class="rounded-br-lg rounded-tl-lg"
            small
            :href="link"
            target="_blank"
            >{{ $t('landing.visit_site') }}
            <v-icon right small>mdi-open-in-new</v-icon></v-btn
          >
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
</style>
