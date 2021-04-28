<template>
  <v-autocomplete
    class="pt-4"
    v-bind="$attrs"
    hide-details
    hide-no-data
    autocomplete="off"
    :search-input.sync="search"
    :clearable="!removeClearable"
    :cache-items="!doNotCache"
    :item-value="$attrs['item-value'] ? $attrs['item-value'] : 'id'"
    :return-object="!$attrs['item-value']"
    v-on="$listeners"
    @change="resetSearchInput"
  />
</template>

<script>
export default {
  name: 'AutocompleteField',
  props: {
    removeClearable: Boolean,
    doNotCache: Boolean,
  },
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
