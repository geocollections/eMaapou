<template>
  <v-data-table
    dense
    calculate-widths
    multi-sort
    :headers="headers"
    :items="items"
    :options="initOptions"
    item-key="_version"
    :server-items-length="count"
    :footer-props="footerProps"
    mobile-breakpoint="0"
    @update:options="handleChange"
  >
    <template #no-data>
      {{ $t('table.noData') }}
    </template>
    <template #top="{ pagination, updateOptions }">
      <v-container fluid>
        <v-row>
          <v-col class="pa-0">
            <v-data-footer
              style="border: none"
              :pagination="pagination"
              :options="initOptions"
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
  name: 'ExternalSearchTableWrapper',
  mixins: [tableMixin],
}
</script>
