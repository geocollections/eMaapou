<template>
  <v-hover v-slot="{ hover }">
    <v-card
      dark
      class="transition-swing"
      :class="{ 'on-hover': hover }"
      :elevation="hover ? 2 : 0"
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
        <div class="rounded-t" style="background-color: #333333cc">
          <v-card-title style="word-break: keep-all" class="montserrat text-h6"
            >{{ title }}
            <v-icon right x-small class="align-self-start">
              mdi-open-in-new
            </v-icon>
          </v-card-title>
          <v-expand-transition>
            <div v-show="hover">
              <v-card-text class="pt-0 montserrat">
                {{ description }}
              </v-card-text>
            </div>
          </v-expand-transition>
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
}
</script>

<style scoped>
.v-card {
  transition: opacity 0.6s ease-in-out;
}

.v-card.on-hover {
  cursor: pointer;
  opacity: 0.9;
}

.grayscale {
  -webkit-filter: grayscale(100%);
  filter: grayscale(100%);
}

.grayscale:hover {
  -webkit-filter: grayscale(0%);
  filter: grayscale(0%);
}
</style>
