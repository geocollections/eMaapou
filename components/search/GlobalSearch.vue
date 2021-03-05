<template>
  <v-text-field
    v-model="search"
    dense
    outlined
    color="deep-orange darken-2"
    append-icon="mdi-magnify"
    :label="$t('common.search')"
    hide-details
    clearable
  ></v-text-field>
</template>

<script>
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'GlobalSearch',
  computed: {
    ...mapFields('landing', ['search']),
  },
}
</script>
