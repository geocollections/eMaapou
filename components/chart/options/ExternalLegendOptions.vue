<template>
  <v-card v-if="!isLoading || true" flat tile>
    <v-card-text class="pb-0">
      <div v-if="enableCheckboxes">
        <div v-if="checkboxesTitle" class="text-body-1 font-weight-bold">
          {{ $t(checkboxesTitle) }}
        </div>
        <div class="d-flex flex-row flex-wrap">
          <v-checkbox
            v-for="(entity, id) in Object.keys(checkboxesObject)"
            :key="id"
            class="px-3 mt-0"
            :label="entity"
            hide-details
            :indeterminate="isIndeterminate(checkboxesObject[entity])"
            :value="isCheckboxChecked(checkboxesObject[entity])"
            @change="handleCheckboxChange($event, checkboxesObject[entity])"
          />
        </div>
      </div>

      <div v-if="enableSelectField">
        <div
          v-if="selectFieldTitle"
          class="text-body-1 font-weight-bold pt-4 pb-2"
        >
          {{ $t(selectFieldTitle) }}
        </div>
        <v-autocomplete
          v-model="selectedItems"
          :items="allItems"
          multiple
          chips
          deletable-chips
          clearable
          small-chips
          outlined
          :error-messages="
            selectedItems.length === 0 ? $t('statistics.isEmptyMessage') : ''
          "
        ></v-autocomplete>
      </div>
    </v-card-text>
  </v-card>

  <v-skeleton-loader v-else class="px-4" width="100%" type="paragraph" />
</template>

<script>
export default {
  name: 'ExternalLegendOptions',
  props: {
    enableCheckboxes: {
      type: Boolean,
      default: true,
      required: false,
    },
    enableSelectField: {
      type: Boolean,
      default: true,
      required: false,
    },
    checkboxesTitle: {
      type: String,
      required: false,
      default: 'statistics.analysisMethods',
    },
    selectFieldTitle: {
      type: String,
      required: false,
      default: 'statistics.activeParameters',
    },
    checkboxesObject: {
      type: Object,
      required: false,
      default: () => {},
    },
    allItems: {
      type: Array,
      required: false,
      default: () => [],
    },
    initSelectedItems: {
      type: Array,
      required: false,
      default: () => ['tere'],
    },
    isLoading: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      selectedItems: this.initSelectedItems,
    }
  },
  watch: {
    selectedItems(newVal) {
      this.$emit('update:selectedItems', newVal)
    },
  },
  methods: {
    isIndeterminate(checkboxList) {
      if (!this.isCheckboxChecked(checkboxList))
        return checkboxList.some((item) => this.selectedItems.includes(item))
    },

    isCheckboxChecked(checkboxList) {
      return checkboxList.every((item) => this.selectedItems.includes(item))
    },

    handleCheckboxChange(bool, items) {
      if (bool) {
        // this.selectedParameters = parameters
        let selected = [...this.selectedItems]
        selected = selected.concat(items)
        this.selectedItems = [...new Set(selected)]
      } else {
        this.selectedItems = this.selectedItems.filter(
          (item) => !items.includes(item)
        )
      }
    },
  },
}
</script>
