<script>
import InputAutocomplete from "~/components/input/InputAutocomplete.vue";

export default {
  name: "InputAutocompleteStratigraphy",
  components: { InputAutocomplete },
  props: {
    label: {
      type: String,
      default: "Stratigraphy",
    },
    chrono: {
      type: Boolean,
      default: false,
    },
    litho: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      items: [],
    };
  },
  computed: {
    itemText() {
      return this.$i18n.locale === "et" ? "stratigraphy" : "stratigraphy_en";
    },
  },
  methods: {
    async handleItemsSearch(value) {
      let query
        = this.$i18n.locale === "et"
          ? `stratigraphy:(*${value}*)`
          : `stratigraphy_en:(*${value}*)`;
      if (this.chrono)
        query += " AND type:1";
      if (this.litho)
        query += " AND type:2";

      const autocompleteResponse
        = await this.$services.sarvSolr.getResourceList("stratigraphy", {
          search: query,
          defaultParams: {
            fl: "id,stratigraphy,stratigraphy_en,hierarchy_string",
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
