<template>
  <div class="align-center justify-space-around fill-height d-flex mr-sm-3">
    <div class="d-flex align-center ml-sm-auto mr-sm-7" style="flex: 0 0 0">
      <div
        v-show="$vuetify.breakpoint.smAndUp"
        class="mr-3 text-no-wrap text-caption"
      >
        {{ itemsPerPageText }}
      </div>
      <v-select
        class="mt-0 text-caption"
        style="max-width: 100px"
        dense
        hide-details
        :items="itemsPerPageOptions"
        :value="options.itemsPerPage"
        :menu-props="{ bottom: true, offsetY: true }"
        @change="changeRowsPerPage"
      />
    </div>
    <div class="justify-end my-1 d-flex align-center">
      <v-btn :disabled="options.page === 1" icon @click="first">
        <v-icon>mdi-page-first</v-icon>
      </v-btn>
      <v-btn :disabled="options.page === 1" icon @click="previous">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <!-- NOTE: Template activator based menu is not visible on page load. For more info look at note in HeaderControls.vue -->
      <v-menu offset-y :close-on-content-click="false">
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            small
            text
            class="text-no-wrap text-caption"
            v-on="on"
          >
            {{ pageSelectText }}
          </v-btn>
        </template>
        <v-card class="px-2 py-2 d-flex align-center">
          <div class="mr-2 text-no-wrap text-caption">{{ goToText }}</div>
          <v-text-field
            ref="go-to-field"
            class="mt-0 text-caption"
            style="width: 64px"
            dense
            hide-details
            :value="goToValue"
            type="number"
            :rules="[pageLimitRule]"
            @keyup.enter="selectPage"
            @input="setGoToValue"
          >
          </v-text-field>
          <v-btn
            :disabled="!pageLimitRule(goToValue)"
            class="px-2 ml-2"
            small
            text
            @click="selectPage"
          >
            {{ goToButtonText }} <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
        </v-card>
      </v-menu>
      <v-btn
        :disabled="options.page === pagination.pageCount"
        icon
        @click="next"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
      <v-btn
        :disabled="options.page === pagination.pageCount"
        icon
        @click="last"
      >
        <v-icon>mdi-page-last</v-icon>
      </v-btn>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PaginationControls',
  props: {
    options: {
      type: Object,
      default: () => {
        return {
          page: 0,
          itemsPerPage: 0,
          sortBy: [],
          sortDesc: [],
          groupBy: [],
          groupDesc: [],
          multiSort: false,
          mustSort: false,
        }
      },
    },
    pagination: {
      type: Object,
      default: () => {
        return {
          itemsLength: 0,
          itemsPerPage: 0,
          page: 1,
          pageCount: 1,
          pageStart: 0,
          pageStop: 0,
        }
      },
    },
    itemsPerPageOptions: {
      type: Array,
      default: () => [],
    },
    itemsPerPageText: {
      type: String,
      default: 'Rows per page',
    },
    pageSelectText: {
      type: String,
      default: `Page 0 / 0`,
    },
    goToText: {
      type: String,
      default: 'Go to page',
    },
    goToButtonText: {
      type: String,
      default: 'Go',
    },
    selectPageId: {
      type: String,
      default: 'page-select-btn',
    },
  },
  data() {
    return {
      goToValue: NaN,
    }
  },
  computed: {
    pages() {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    },
  },
  methods: {
    setGoToValue(e) {
      if (isNaN(e)) this.goToValue = e
      else this.goToValue = parseInt(e)
    },
    selectPage() {
      if (this.$refs['go-to-field'].validate(true)) {
        this.$emit('update:options', {
          ...this.options,
          page: this.goToValue,
        })
        this.goToValue = NaN
      }
    },
    next() {
      this.$emit('update:options', {
        ...this.options,
        page: this.options.page + 1,
      })
    },
    previous() {
      this.$emit('update:options', {
        ...this.options,
        page: this.options.page - 1,
      })
    },
    first() {
      this.$emit('update:options', {
        ...this.options,
        page: 1,
      })
    },
    last() {
      this.$emit('update:options', {
        ...this.options,
        page: this.pagination.pageCount,
      })
    },
    changeRowsPerPage(e) {
      this.$emit('update:options', {
        ...this.options,
        itemsPerPage: e,
        page: 1,
      })
    },
    pageLimitRule(value) {
      if (isNaN(value)) return false
      if (parseInt(value) < 1) return false
      if (parseInt(value) > this.pagination.pageCount) return false
      return true
    },
  },
}
</script>

<style lang="scss" scoped>
// Removes arrows from number input
/* Chrome, Safari, Edge, Opera */
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
::v-deep input[type='number'] {
  -moz-appearance: textfield;
}
</style>
