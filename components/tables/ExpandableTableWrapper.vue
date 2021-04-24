<template>
  <v-data-table
    dense
    calculate-widths
    multi-sort
    show-expand
    :single-expand="singleExpand"
    :expanded.sync="expanded"
    :headers="headers"
    :items="items"
    :options="options"
    :server-items-length="count"
    :footer-props="footerProps"
    mobile-breakpoint="0"
    @update:options="handleChange"
  >
    <template #no-data>{{ $t('table.noData') }}</template>
    <template #top="{ pagination, updateOptions, options }">
      <v-row no-gutters>
        <v-col cols="12" sm="4" class="py-0 px-3">
          <v-text-field
            v-model="search"
            color="primary darken-2"
            append-icon="mdi-magnify"
            :label="$t('common.search')"
            hide-details
            clearable
            @input="handleSearch"
          ></v-text-field>
        </v-col>
        <v-col class="pa-0">
          <v-data-footer
            style="border: none"
            :pagination="pagination"
            :options="options"
            :show-first-last-page="footerProps.showFirstLastPage"
            :items-per-page-options="footerProps['items-per-page-options']"
            :items-per-page-text="footerProps['items-per-page-text']"
            @update:options="updateOptions"
          />
        </v-col>
      </v-row>
    </template>
    <template #item.data-table-expand="{ expand, isExpanded, item }">
      <v-btn
        v-if="item.canExpand"
        icon
        :class="{ active: isExpanded }"
        @click="expand(!isExpanded)"
      >
        <v-icon>mdi-chevron-down</v-icon>
      </v-btn>
    </template>
    <template v-for="(_, slotName) in $scopedSlots" #[slotName]="context">
      <slot :name="slotName" v-bind="context" />
    </template>
  </v-data-table>
</template>

<script>
import tableMixin from '~/mixins/tableMixin'

export default {
  name: 'ExpandableTableWrapper',
  mixins: [tableMixin],
  props: {
    singleExpand: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      expanded: [],
    }
  },
}
</script>

<style lang="scss" scoped>
.v-btn.active .v-icon {
  transform: rotate(-180deg);
}
</style>
