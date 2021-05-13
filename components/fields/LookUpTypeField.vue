<template>
  <v-select
    v-bind="$attrs"
    hide-details
    dense
    :items="computedLookUpTypes"
    v-on="$listeners"
  >
    <template
      v-if="customPrependInner && customPrependInner.length > 0"
      #prepend-inner
    >
      <div class="custom-prepend-inner">{{ customPrependInner }}</div>
    </template>
  </v-select>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'LookUpTypeField',
  props: {
    customPrependInner: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'all',
    },
  },
  computed: {
    ...mapState('globalSearch', ['lookUpTypes']),

    computedLookUpTypes() {
      return this.lookUpTypes.filter((item) => {
        if (this.type === 'range') return item.text.includes(' than')
        else return item
      })
    },
  },
}
</script>

<style scoped>
.custom-prepend-inner {
  margin: 5px 4px 3px 0;
  font-weight: bold;
  color: black;
  white-space: nowrap;
}
</style>
