<template>
  <v-card :flat="$attrs.flat">
    <v-data-table
      id="table"
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
        <div>
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
          </v-row>

          <v-row no-gutters>
            <v-col cols="auto" class="px-3 my-3" align-self="center">
              <v-menu transition="slide-y-transition" offset-y bottom right>
                <template #activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    aria-label="export table"
                    class="d-block"
                    v-bind="attrs"
                    v-on="on"
                  >
                    {{ $t('common.export') }}
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item @click="handleExportCsv()">
                    <v-list-item-title>CSV</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="handleExportExcel()">
                    <v-list-item-title>XLSX (Excel)</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="handleClipboard()">
                    <v-list-item-title>
                      {{ $t('common.clipboard') }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
            <v-col>
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
        </div>
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
