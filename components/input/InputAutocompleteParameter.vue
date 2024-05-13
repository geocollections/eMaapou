<script>
import InputAutocomplete from "~/components/input/InputAutocomplete.vue";

export default {
  name: "InputAutocompleteParameter",
  components: { InputAutocomplete },
  props: {
    // TODO: Do these need to be here? Doesn't `v-bind` already pass them on?
    label: {
      type: String,
      default: "Parameter",
    },
    multiSelect: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      items: [],
    };
  },
  async fetch() {
    const autocompleteResponse = await this.$services.sarvSolr.getResourceList(
      "analysis_parameter",
      {
        defaultParams: {
          fq: `is_null:false`,
        },
        options: {
          page: 1,
          itemsPerPage: 400, // TODO: if the number of parameters exceeds `itemsPerPage`, some of the parameters are not shows. Should query the count before, use it to query the parameters.
        },
      },
    );
    this.items = autocompleteResponse.items.map((parameter) => {
      return { text: parameter.parameter, value: parameter.parameter_index };
    });
  },
};
</script>

<template>
  <InputAutocomplete
    v-bind="$attrs"
    return-object
    :multi-select="multiSelect"
    :items="items"
    :label="label"
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
