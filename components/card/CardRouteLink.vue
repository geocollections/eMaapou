<template>
  <v-hover v-slot="{ hover }">
    <v-card
      nuxt
      :to="localePath(route.routeName)"
      class="mx-sm-1 mb-1 mb-sm-2 d-flex"
      :elevation="hover ? 2 : 1"
      :color="hover ? 'accent lighten-1' : 'accent'"
    >
      <div class="py-2 d-flex d-sm-block align-center">
        <v-icon
          v-if="$vuetify.breakpoint.smAndUp"
          class="pl-3"
          color="accent lighten-2"
          left
        >
          {{ route.icon }}
        </v-icon>
        <div
          class="
            text-h5 text-sm-h4
            pl-2 pl-sm-3
            pt-sm-2
            font-weight-bold
            white--text
          "
        >
          {{
            Math.max(
              Math.floor(route.count / 1000) * 1000,
              Math.floor(route.count / 100) * 100
            )
              .toLocaleString()
              .replace(/,/g, '\u00A0')
          }}+
        </div>
        <div
          class="font-weight-regular text-h6 pl-3 pt-0 white--text"
          :class="{
            'text-body-1': $vuetify.breakpoint.smAndDown,
          }"
        >
          <div class="montserrat">
            {{ $t(route.text) }}
          </div>
        </div>
      </div>
      <v-icon color="accent lighten-2" class="ml-auto pr-2">
        mdi-arrow-right
      </v-icon>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  name: 'CardRouteLink',
  props: {
    route: {
      type: Object,
      required: true,
    },
  },
}
</script>
