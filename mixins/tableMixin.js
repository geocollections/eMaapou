import { debounce } from 'lodash'

export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    headers: {
      type: Array,
      default: () => [],
    },
    initOptions: {
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
    externalOptions: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      search: '',
      options: this.initOptions,
      footerProps: {
        'items-per-page-options': [10, 25, 50, 100],
        'items-per-page-text': this.$t('table.itemsPerPage'),
      },
    }
  },
  methods: {
    handleChange(options) {
      if (!this.externalOptions) {
        this.options = options
      }
      this.$emit('update', { tableOptions: options, search: this.search })
    },
    handleSearch: debounce(function () {
      if (!this.externalOptions) {
        this.options = { ...this.options, page: 1 }
      }
      this.$emit('update', {
        tableOptions: { ...this.options, page: 1 },
        search: this.search,
      })
    }, 500),
  },
}
