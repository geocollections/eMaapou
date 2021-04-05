<template>
  <v-autocomplete
    v-bind="$attrs"
    hide-details
    hide-no-data
    autocomplete="off"
    :search-input.sync="search"
    cache-items
    clearable
    v-on="$listeners"
    @change="resetSearchInput"
  />
</template>

<script>
export default {
  name: 'AutocompleteSearchField',
  data() {
    return {
      search: null,
    }
  },
  watch: {
    search(newVal, oldVal) {
      const currentValue =
        this.$attrs.value && this.$attrs.value[this.$attrs['item-text']]

      if (
        newVal &&
        newVal.length > 0 &&
        newVal !== currentValue &&
        newVal !== oldVal
      ) {
        this.$emit('search:items', newVal)
      }
    },
  },
  methods: {
    resetSearchInput() {
      if (this.search && this.search.length > 0) {
        this.search = null
      }
    },
  },
}
</script>

<style scoped></style>
