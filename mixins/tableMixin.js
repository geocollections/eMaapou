import { debounce } from 'lodash'
import XLSX from 'xlsx'

export default {
  props: {
    onlyTable: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      default: () => [],
    },
    headers: {
      type: Array,
      default: () => [],
    },
    options: {
      type: Object,
      default: () => {},
    },
    count: {
      type: Number,
      default: 0,
    },
    showSearch: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      search: '',
      footerProps: {
        showFirstLastPage: true,
        'items-per-page-options': [10, 25, 50, 100, 250, 500, 1000],
        'items-per-page-text': this.$t('table.itemsPerPage'),
      },
    }
  },
  methods: {
    handleChange(options) {
      this.$emit('update', { options, search: this.search })
    },
    filterItemsByKeys(items, keys) {
      const filteredItems = items.map((item) => {
        const res = {}

        Object.keys(item).forEach((key) => {
          if (keys.includes(key)) {
            res[key] = item[key]
          }
        })
        return res
      })
      return filteredItems
    },
    handleExportCsv() {
      try {
        const tableCopy = document.querySelector('#table table').cloneNode(true)
        const children = tableCopy.querySelectorAll(
          'thead > tr > th > .v-data-table-header__sort-badge'
        )
        children.forEach((child) => {
          child.parentElement.removeChild(child)
        })

        const wb = XLSX.utils.table_to_book(tableCopy)

        XLSX.writeFile(wb, 'export.csv', { bookType: 'csv' })
      } catch (err) {
        console.error(err)
      }
    },
    handleExportExcel() {
      try {
        const tableCopy = document.querySelector('#table table').cloneNode(true)
        const children = tableCopy.querySelectorAll(
          'thead > tr > th > .v-data-table-header__sort-badge'
        )
        children.forEach((child) => {
          child.parentElement.removeChild(child)
        })

        const wb = XLSX.utils.table_to_book(tableCopy)

        XLSX.writeFile(wb, 'export.xlsx', { bookType: 'xlsx' })
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
    handleSearch: debounce(function () {
      const options = { ...this.options, page: 1 }
      this.$emit('update', {
        options,
        search: this.search,
      })
    }, 500),
  },
}
