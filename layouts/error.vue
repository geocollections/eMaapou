<template>
  <v-main>
    <v-container :fluid="$vuetify.breakpoint.lgAndDown">
      <v-row no-gutters>
        <v-col>
          <div class="pt-15">
            <detail-error :error="error" />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import DetailError from '~/components/DetailError.vue'
export default {
  components: { DetailError },
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
}
</script>
