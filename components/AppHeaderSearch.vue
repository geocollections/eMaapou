<template>
  <v-text-field
    class="shrink"
    :value="search"
    hide-details
    dense
    solo-inverted
    :label="$t('common.search')"
    autocomplete="off"
    append-icon="mdi-magnify"
    @click:append="handleSearch"
    @keyup.enter="handleSearch"
    @input="updateSearch"
  ></v-text-field>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { isEmpty } from 'lodash'

export default {
  name: 'AppHeaderSearch',
  computed: {
    ...mapState('landing', ['search']),
  },
  methods: {
    ...mapActions('landing', ['updateSearch']),

    handleSearch() {
      const routeName = this.$route.name.includes('search')
        ? this.$route.name.split('__')[0]
        : 'search'
      const query = isEmpty(this.search)
        ? { ...this.$route.query }
        : { ...this.$route.query, q: this.search }
      this.$router.push(this.localePath({ name: routeName, query }))
    },
  },
}
</script>
