<template>
  <v-select
    v-bind="$attrs"
    hide-details
    dense
    :items="translatedPaginateByOptions"
    v-on="$listeners"
  />
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'PaginateByField',
  computed: {
    ...mapState('search', ['paginateByOptions']),

    translatedPaginateByOptions() {
      return this.paginateByOptions.map((item) => {
        return {
          ...item,
          text: this.$t(item.text, { value: item.value }),
        }
      })
    },
  },
}
</script>

<style scoped></style>
