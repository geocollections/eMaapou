<template>
  <v-data-table
    dense
    calculate-widths
    multi-sort
    :headers="headers"
    :items="items"
    :options.sync="options"
    :server-items-length="count"
    :footer-props="footerProps"
    mobile-breakpoint="0"
    @update:options="handleChange"
  >
    <template #no-data>{{ $t('table.noData') }}</template>
    <template #top="{ pagination, updateOptions }">
      <v-container>
        <v-row>
          <v-col class="pa-0">
            <v-data-footer
              style="border: none"
              :pagination="pagination"
              :options="options"
              :items-per-page-options="footerProps['items-per-page-options']"
              :items-per-page-text="footerProps['items-per-page-text']"
              @update:options="updateOptions"
            />
          </v-col>
        </v-row>
      </v-container>
    </template>
    <template v-for="(_, slotName) in $scopedSlots" #[slotName]="context">
      <slot :name="slotName" v-bind="context" />
    </template>
  </v-data-table>
</template>

<script>
import tableMixin from '~/mixins/tableMixin'

export default {
  name: 'TableWrapper',
  mixins: [tableMixin],
  props: {
    externalSearch: {
      type: String,
      default: '',
    },
  },
  watch: {
    externalSearch: {
      handler(newValue) {
        this.options.page = 1
      },
    },
  },
}
</script>
