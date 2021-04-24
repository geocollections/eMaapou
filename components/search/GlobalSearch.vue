<template>
  <v-text-field
    v-model="search"
    outlined
    class="search-input frontsearch"
    color="primary darken-2"
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

<style scoped lang="scss">
.v-text-field--outlined ::v-deep fieldset {
  border-color: var(--v-primary-base);
  border-width: 2px;
}
</style>
