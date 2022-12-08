<template>
  <v-row no-gutters>
    <v-col v-if="error" class="pt-5">
      <detail-error :error="error" />
    </v-col>
    <v-col v-else-if="!loading" class="pt-5">
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
