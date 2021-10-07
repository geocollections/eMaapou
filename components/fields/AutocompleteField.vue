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
    :return-object="returnObject"
    v-on="$listeners"
  >
    <template #item="{ item }">
      <v-list-item-content>
        {{ item[$attrs['item-text']] }}
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>

<script>
export default {
  name: 'AutocompleteField',
  props: {
    removeClearable: Boolean,
    doNotCache: Boolean,
    returnObject: {
      type: Boolean,
      default() {
        return !this.$attrs['item-value']
      },
    },
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
}
</script>

<style scoped></style>
