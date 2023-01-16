<template>
  <v-main>
    <v-container
      class="pt-1 pb-10"
      style="min-height: 100vh"
      :fluid="$vuetify.breakpoint.lgAndDown"
    >
      <v-row no-gutters>
        <v-col>
          <client-only>
            <history-viewer v-if="$vuetify.breakpoint.smAndUp" />
          </client-only>
        </v-col>
      </v-row>
      <v-row no-gutters class="fill-height">
        <v-fade-transition hide-on-leave>
          <v-col v-if="error" key="detail-error" class="pt-5">
            <div>
              <detail-error :error="error" />
            </div>
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
                <div class="montserrat">{{ $t('common.loading') }}</div>
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
      <fab-scroll-top />
    </v-container>
    <app-footer />
  </v-main>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import DetailError from '~/components/DetailError.vue'

import AppFooter from '~/components/AppFooter.vue'
import FabScrollTop from '~/components/FabScrollTop.vue'
// import CookieConsent from '~/components/CookieConsent.vue'
import HistoryViewer from '~/components/HistoryViewer.vue'
export default defineComponent({
  name: 'Detail',
  // eslint-disable-next-line vue/no-unused-components
  components: { DetailError, HistoryViewer, FabScrollTop, AppFooter },
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
