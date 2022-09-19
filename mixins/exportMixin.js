import { utils, writeFile } from 'xlsx'

export default {
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
        const wb = this.createWorkbook(document.querySelector('#table table'))

        writeFile(wb, 'export.csv', { bookType: 'csv' })
      } catch (err) {
        console.error(err)
      }
    },
    handleExportExcel() {
      try {
        const wb = this.createWorkbook(document.querySelector('#table table'))

        writeFile(wb, 'export.xlsx', { bookType: 'xlsx' })
      } catch (err) {
        console.error(err)
      }
    },
    handleClipboard() {
      const el = document
        .getElementById('table')
        .getElementsByTagName('table')[0]

      const body = document.body
      let range
      let sel
      if (document.createRange && window.getSelection) {
        range = document.createRange()
        sel = window.getSelection()
        sel.removeAllRanges()
        try {
          range.selectNodeContents(el)
          sel.addRange(range)
        } catch (e) {
          range.selectNode(el)
          sel.addRange(range)
        }
      } else if (body.createTextRange) {
        range = body.createTextRange()
        range.moveToElementText(el)
        range.select()
      }
      document.execCommand('Copy')
      sel.removeAllRanges()
    },
  },
}
