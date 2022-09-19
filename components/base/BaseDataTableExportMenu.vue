<template>
  <v-menu transition="slide-y-transition" offset-y bottom right>
    <template #activator="menu">
      <v-tooltip bottom open-delay="500">
        <template #activator="tooltip">
          <v-btn
            aria-label="export table"
            class="montserrat"
            v-bind="{ ...menu.attrs, ...tooltip.attrs }"
            icon
            v-on="{ ...menu.on, ...tooltip.on }"
          >
            <v-icon>mdi-file-export-outline</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('table.tooltipExport') }}</span>
      </v-tooltip>
    </template>
    <v-list>
      <v-list-item @click="handleExportCsv">
        <v-list-item-title>CSV</v-list-item-title>
      </v-list-item>
      <v-list-item @click="handleExportExcel">
        <v-list-item-title>XLSX (Excel)</v-list-item-title>
      </v-list-item>
      <v-list-item @click="handleClipboard">
        <v-list-item-title>
          {{ $t('common.clipboard') }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { writeFile, utils } from 'xlsx'

export default {
  name: 'BaseDataTableExportMenu',
  props: {
    tableElement: {
      type: undefined,
      required: true,
    },
  },
  methods: {
    removeSortIndicators(table) {
      const tableCopy = table.cloneNode(true)
      const sortIndicators = tableCopy.querySelectorAll(
        'thead > tr > th > .v-data-table-header__sort-badge'
      )
      sortIndicators.forEach((indicator) => {
        indicator.parentElement.removeChild(indicator)
      })
      return tableCopy
    },
    createWorkbook(table) {
      const tableCopy = this.removeSortIndicators(table)
      const wb = utils.table_to_book(tableCopy)
      return wb
    },
    handleExportCsv() {
      try {
        const wb = this.createWorkbook(this.tableElement)

        writeFile(wb, 'export.csv', { bookType: 'csv' })
      } catch (err) {
        console.error(err)
      }
    },
    handleExportExcel() {
      try {
        const wb = this.createWorkbook(this.tableElement)

        writeFile(wb, 'export.xlsx', { bookType: 'xlsx' })
      } catch (err) {
        console.error(err)
      }
    },
    handleClipboard() {
      const body = document.body
      let range
      let sel
      if (document.createRange && window.getSelection) {
        range = document.createRange()
        sel = window.getSelection()
        sel.removeAllRanges()
        try {
          range.selectNodeContents(this.tableElement)
          sel.addRange(range)
        } catch (e) {
          range.selectNode(this.tableElement)
          sel.addRange(range)
        }
      } else if (body.createTextRange) {
        range = body.createTextRange()
        range.moveToElementText(this.tableElement)
        range.select()
      }
      document.execCommand('Copy')
      sel.removeAllRanges()
    },
  },
}
</script>
