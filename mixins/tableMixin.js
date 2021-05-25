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
    handleExport() {
      // const fields = this.headers.map((header) => {
      //   return header.value
      // })
      try {
        const ws = XLSX.utils.json_to_sheet(this.items)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Export')
        console.log(ws)
        XLSX.writeFile(wb, 'export.csv', { bookType: 'csv' })
      } catch (err) {
        console.error(err)
      }
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
