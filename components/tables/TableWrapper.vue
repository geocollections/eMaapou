<template>
  <v-card>
    <v-data-table
      dense
      calculate-widths
      multi-sort
      :headers="headers"
      :items="items"
      :options="options"
      item-key="_version"
      :server-items-length="count"
      :footer-props="footerProps"
      mobile-breakpoint="0"
      :hide-default-footer="onlyTable"
      @update:options="handleChange"
    >
      <template #no-data>{{ $t('table.noData') }}</template>
      <!-- eslint-disable-next-line vue/no-template-shadow -->
      <template v-if="!onlyTable" #top="{ pagination, updateOptions, options }">
        <v-row no-gutters>
          <v-col v-if="showSearch" cols="12" sm="4" class="py-0 px-3">
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
      <template v-for="(_, slotName) in $scopedSlots" #[slotName]="context">
        <slot :name="slotName" v-bind="context" />
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import tableMixin from '~/mixins/tableMixin'
export default {
  name: 'TableWrapper',
  mixins: [tableMixin],
}
</script>
