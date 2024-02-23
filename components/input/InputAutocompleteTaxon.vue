<script>
import InputAutocomplete from "~/components/input/InputAutocomplete.vue";

export default {
  name: "InputAutocompleteTaxon",
  components: { InputAutocomplete },
  props: {
    label: {
      type: String,
      default: "Taxon",
    },
  },
  data() {
    return {
      items: [],
    };
  },
  computed: {
    itemText() {
      return this.$i18n.locale === "et" ? "taxon" : "taxon";
    },
  },
  methods: {
    async handleItemsSearch(value) {
      const query = `taxon:(*${value}*)`;

      const autocompleteResponse
        = await this.$services.sarvSolr.getResourceList("taxon", {
          defaultParams: {
            fq: query,
          },
          options: {
            page: 1,
            itemsPerPage: 25,
          },
        });
      this.items = autocompleteResponse.items;
    },
  },
};
</script>

<template>
  <InputAutocomplete
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
