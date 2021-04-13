<template>
  <v-text-field
    v-if="$vuetify.breakpoint.mdAndUp"
    class="d-flex shrink expanding-search"
    :class="{
      closed: searchClosed && !search && $vuetify.breakpoint.xsOnly,
    }"
    :value="search"
    hide-details
    dense
    solo-inverted
    clearable
    :label="$t('common.search')"
    autocomplete="off"
    prepend-inner-icon="mdi-magnify"
    @keyup.enter="handleSearch"
    @input="updateSearch"
    @change="updateSearch"
    @focus="searchClosed = false"
    @blur="searchClosed = true"
  ></v-text-field>
  <v-btn v-else icon class="header-icon-button" @click="handleSearch">
    <v-icon>mdi-magnify</v-icon>
  </v-btn>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'AppHeaderSearch',
  data() {
    return {
      searchClosed: true,
    }
  },
  computed: {
    ...mapState('landing', ['search']),
  },
  methods: {
    ...mapActions('landing', ['updateSearch']),

    handleSearch() {
      const routeName = this.$route.name.includes('search')
        ? this.$route.name.split('__')[0]
        : 'search'
      // const query = isEmpty(this.search)
      //   ? { ...this.$route.query }
      //   : { ...this.$route.query, q: this.search }
      this.$router.push(this.localePath({ name: routeName }))
    },
  },
}
</script>

<style lang="scss">
.v-input.expanding-search {
  transition: max-width 0.5s;

  .v-input__slot {
    cursor: pointer !important;
  }

  &.closed {
    max-width: 45px;

    .v-input__slot {
      background: transparent !important;
      box-shadow: none !important;
    }
  }
}
</style>
