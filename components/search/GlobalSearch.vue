<template>
  <v-text-field
    v-model="search"
    outlined
    height=""
    class=""
    color="primary darken-2"
    :label="$t('common.searchAlt')"
    hide-details
    clearable
    autofocus
    @input="$emit('input')"
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
