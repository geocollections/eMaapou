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
      <div :class="{ 'd-flex flex-row flex-nowrap': appendItem }">
        <div :class="{ 'whitespace-nowrap mr-2': appendItem }">
          {{ item[$attrs['item-text']] }}
        </div>
        <div v-if="appendItem" class="truncate">({{ item[appendItem] }})</div>
      </div>
    </template>
  </v-autocomplete>
</template>

<script>
export default {
  name: 'InputAutocomplete',
  props: {
    removeClearable: Boolean,
    doNotCache: Boolean,
    appendItem: {
      type: String,
      default: '',
    },
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
