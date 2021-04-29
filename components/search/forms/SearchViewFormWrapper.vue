<template>
  <v-card>
    <v-card-title class="py-1">
      <div class="card-title--clickable" @click="showSearch = !showSearch">
        <span>{{ $t('common.showSearch') }}</span>
        <v-icon class="pb-1">mdi-magnify</v-icon>
      </div>
      <v-spacer></v-spacer>
      <v-btn icon @click="showSearch = !showSearch">
        <v-icon>{{
          showSearch ? 'mdi-chevron-up' : 'mdi-chevron-down'
        }}</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text v-show="showSearch" class="px-3 pb-3 pt-1">
      <slot>Default slot: add search here</slot>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'SearchViewFormWrapper',
  computed: {
    ...mapFields('settings', {
      showSearch: 'showSearchViewForm',
    }),
  },
}
</script>

<style scoped lang="scss">
.card-title--clickable {
  transition: opacity 200ms ease-in-out;

  &:hover {
    cursor: pointer;
    opacity: 0.7;
  }
}
</style>
