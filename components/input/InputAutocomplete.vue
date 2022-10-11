<template>
  <v-autocomplete
    v-bind="$attrs"
    class="pt-4"
    hide-details
    hide-no-data
    :clearable="clearable"
    :no-filter="apiSearch"
    :search-input.sync="search"
    :loading="isLoading"
    :items="internalItems"
    :item-value="$attrs['item-value'] ? $attrs['item-value'] : 'id'"
    :return-object="returnObject"
    :chips="multiSelect"
    :deletable-chips="multiSelect"
    :multiple="multiSelect"
    :small-chips="multiSelect"
    v-on="$listeners"
  >
  </v-autocomplete>
</template>

<script>
import debounce from 'lodash/debounce'
export default {
  name: 'InputAutocomplete',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    returnObject: {
      type: Boolean,
      default: false,
    },
    apiSearch: {
      type: Boolean,
      default: false,
    },
    multiSelect: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      search: null,
      isLoading: false,
      internalItems: [],
    }
  },
  watch: {
    items(value) {
      this.isLoading = false
      this.internalItems = value
    },
    search(newVal, oldVal) {
      this.handleSearch(newVal, oldVal)
    },
  },
  created() {
    if (this.multiSelect && this.$attrs.value)
      this.internalItems = this.$attrs.value
    else if (this.$attrs.value) this.internalItems.push(this.$attrs.value)
  },
  methods: {
    handleSearch: debounce(function (newVal, oldVal) {
      if (!this.apiSearch) return
      if (!newVal) return
      if (newVal.length < 3) return
      if (newVal === oldVal) return

      const currentValue =
        this.$attrs.value && this.$attrs.value[this.$attrs['item-text']]
      if (newVal === currentValue) return
      this.isLoading = true
      this.$emit('search:items', newVal)
    }, 300),
  },
}
</script>

<style scoped>
.whitespace-nowrap {
  white-space: nowrap;
}
.truncate {
  width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
