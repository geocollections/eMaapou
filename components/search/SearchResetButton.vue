<template>
  <v-btn
    outlined
    color="grey"
    class="reset-search mr-2 px-3 montserrat rounded text-body-1 text-capitalize"
    :icon="$vuetify.breakpoint.mdOnly"
    @click="$emit('click')"
  >
    <v-tooltip v-if="$vuetify.breakpoint.mdOnly" bottom>
      <template #activator="{ on }">
        <v-icon :right="!$vuetify.breakpoint.mdOnly" v-on="on">
          {{ icons.mdiEraser }}
        </v-icon>
      </template>

      <span>
        {{ $t('common.resetSearchLong') }}
      </span>
    </v-tooltip>
    <v-icon v-else left>{{ icons.mdiEraser }}</v-icon>
    <span class="hidden-md-only montserrat">
      {{ $t('common.resetSearch') }}
    </span>
  </v-btn>
</template>
<script>
import { mdiEraser } from '@mdi/js'
export default {
  name: 'SearchResetButton',
  computed: {
    icons() {
      return {
        mdiEraser,
      }
    },
  },
}
</script>

<style scoped>
.reset-search {
  transition: all 200ms ease-in-out;
}
</style>
