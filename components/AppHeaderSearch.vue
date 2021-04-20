<template>
  <v-text-field
    v-if="$vuetify.breakpoint.mdAndUp"
    ref="searchInput"
    class="shrink expanding-search mx-0"
    :class="{ closed: searchClosed && !search }"
    :value="search"
    hide-details
    dense
    solo-inverted
    flat
    tile
    clearable
    autocomplete="off"
    @keyup.enter="handleSearch"
    @change="updateSearch"
    @focus="searchClosed = false"
    @blur="handleBlur"
  >
    <template #append-outer>
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn
            class="font-weight-bold"
            text
            height="38px"
            v-bind="attrs"
            @click="handleClick"
            v-on="on"
          >
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </template>
        {{ $t('common.searchCommand') }}
      </v-tooltip>
    </template>
  </v-text-field>
  <v-btn
    v-else
    class="font-weight-bold"
    text
    height="38px"
    @click="handleSearch"
  >
    <v-icon>mdi-magnify</v-icon>
  </v-btn>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { isEmpty } from 'lodash'
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

      this.$router.push(this.localePath({ name: routeName }))
    },
    handleBlur() {
      if (isEmpty(this.search)) {
        // HACK: Done to prevent blur event firing before button click.
        // Seems a bit hacky, probably there is a better way of doing this.
        setTimeout(() => {
          this.searchClosed = true
        }, 200)
      }
    },
    handleClick() {
      if (this.$vuetify.breakpoint.xsOnly) {
        this.handleSearch()
        return
      }

      if (this.searchClosed) {
        this.searchClosed = false
        this.$refs.searchInput.focus()
      } else {
        this.handleSearch()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.v-input.expanding-search {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  transition: max-width 0.5s;
  ::v-deep .v-input__append-outer {
    margin: 0 !important;
  }

  ::v-deep .v-input__slot {
    cursor: pointer !important;
  }

  &:not(.closed) {
    ::v-deep .v-input__append-outer {
      .v-btn {
        border-top-right-radius: 4px !important;
        border-bottom-right-radius: 4px !important;
        border-top-left-radius: 0px !important;
        border-bottom-left-radius: 0px !important;
        background: var(--v-primary-darken2) !important;
        border-width: 1px;
        border-style: solid;
        border-color: white;
      }
    }
  }

  &.closed {
    max-width: 64px;

    ::v-deep .v-input__slot {
      background: transparent !important;
      box-shadow: none !important;
    }
  }
}
</style>
