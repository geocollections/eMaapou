<template>
  <input-autocomplete
    v-bind="$attrs"
    :items="items"
    :label="label"
    :item-text="itemText"
    return-object
    api-search
    @search:items="handleItemsSearch"
    v-on="$listeners"
  />
</template>

<script>
import InputAutocomplete from '~/components/input/InputAutocomplete.vue'
export default {
  name: 'InputAutocompleteReference',
  components: { InputAutocomplete },
  props: {
    label: {
      type: String,
      default: 'Reference',
    },
  },
  data() {
    return {
      items: [],
    }
  },
  methods: {
    itemText(item) {
      return `${item.reference} (${item.title})`
    },
    async handleItemsSearch(value) {
      const query = `reference:(*${value}*)`

      const autocompleteResponse =
        await this.$services.sarvSolr.getResourceList('reference', {
          defaultParams: {
            fq: query,
          },
          options: {
            page: 1,
            itemsPerPage: 25,
          },
        })
      this.items = autocompleteResponse.items
    },
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
