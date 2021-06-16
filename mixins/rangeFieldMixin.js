import { isEmpty } from 'lodash'

export default {
  props: {
    value: {
      type: Array,
      default: () => {
        return [null, null]
      },
    },
    label: {
      type: String,
      default: null,
    },
    fieldLabels: {
      type: Object,
      default: () => {
        return { min: 'min', max: 'max' }
      },
    },
  },
  methods: {
    parseInput(input) {
      if (isEmpty(input)) return null
      else return parseInt(input)
    },
    handleInput(e, isMin) {
      if (isMin) {
        this.$emit('input', [this.parseInput(e), this.value[1]])
      } else {
        this.$emit('input', [this.value[0], this.parseInput(e)])
      }
    },
  },
}
