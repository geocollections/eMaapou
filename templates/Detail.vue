<template>
  <v-row no-gutters class="fill-height">
    <v-fade-transition hide-on-leave>
      <v-col v-if="error" key="detail-error" class="pt-5">
        <detail-error :error="error" />
      </v-col>
      <v-col v-else-if="loading" key="detail-loading" class="pt-5">
        <div
          :style="`height: 100%; width: 100%`"
          class="d-flex align-center justify-center"
        >
          <v-progress-circular
            indeterminate
            color="accent"
            :size="150"
            :width="8"
          >
            <div class="montserrat">Loading</div>
          </v-progress-circular>
        </div>
      </v-col>
      <v-col v-else key="detail" class="pt-5">
        <slot name="title" />
        <div class="px-0 px-sm-3">
          <slot name="top" />
          <slot>
            <v-card>
              <v-row no-gutters justify="center">
                <v-col v-if="$slots['column-left']" cols>
                  <slot name="column-left" />
                </v-col>
                <v-col v-if="$slots['column-right']" cols="12" md="6">
                  <slot name="column-right" />
                </v-col>
              </v-row>
            </v-card>
          </slot>
          <slot name="bottom" />
        </div>
      </v-col>
    </v-fade-transition>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import DetailError from '~/components/DetailError.vue'

export default defineComponent({
  name: 'Detail',
  components: { DetailError },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Object as PropType<Error | null>,
      default: null,
    },
  },
})
</script>
