<template>
  <v-expansion-panel style="background-color: transparent">
    <v-expansion-panel-header
      class="py-1 pl-2 pr-1 font-weight-medium"
      style="min-height: 40px; border-bottom: 1px solid lightgray !important"
    >
      {{ label }}
    </v-expansion-panel-header>
    <div
      v-if="value[0] !== null || value[1] !== null"
      class="white"
      style="border-bottom: 1px solid lightgray !important"
    >
      <div class="d-flex py-1 px-2">
        <span>
          <input
            type="checkbox"
            class="checkbox"
            checked
            @click.prevent.stop="handleRemove"
          />
        </span>
        <span class="align-self-center pl-2 text-body-2 font-weight-medium">
          {{ valueString }}
        </span>
      </div>
    </div>
    <v-expansion-panel-content
      class="pt-1"
      color="white"
      style="border-bottom: 1px solid lightgray !important"
    >
      <v-row>
        <v-col cols="6">
          <v-text-field
            :value="value[0]"
            color="primary darken-3"
            :label="fieldLabels.min"
            hide-details
            single-line
            type="number"
            :step="step"
            @input="handleInput($event, true)"
            @keydown.enter.prevent.stop="handleEnter"
            @blur="handleEnter"
          >
          </v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            :value="value[1]"
            color="primary darken-3"
            :label="fieldLabels.max"
            hide-details
            single-line
            type="number"
            :step="step"
            @input="handleInput($event, false)"
            @keydown.enter.prevent.stop="handleEnter"
            @blur="handleEnter"
          />
        </v-col>
      </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  PropType,
  ref,
  useContext,
  watch,
} from '@nuxtjs/composition-api'
import isEmpty from 'lodash/isEmpty'
import { mdiClose } from '@mdi/js'
export default defineComponent({
  name: 'FilterInputRange',
  props: {
    value: {
      type: Array as PropType<(null | number)[]>,
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
    intervalLabels: {
      type: String,
      default: 'intervals.default',
    },
    numberType: {
      type: String as PropType<'int' | 'float'>,
      default: 'int',
    },
    step: {
      type: Number,
      default: 1,
    },
  },
  setup(props, { emit }) {
    const { i18n } = useContext()
    const parseInput = (input: string) => {
      if (isEmpty(input)) return null

      if (props.numberType === 'float') {
        return parseFloat(input)
      } else return parseInt(input)
    }

    const internalValue = ref<(null | number)[]>([null, null])

    watch(
      () => props.value,
      (val) => {
        internalValue.value = val
      }
    )
    const handleEnter = () => {
      if (
        props.value[0] === internalValue.value[0] &&
        props.value[1] === internalValue.value[1]
      )
        return

      emit('input', internalValue.value)
    }
    const handleInput = (input: string, isMin: boolean) => {
      if (isMin) {
        internalValue.value = [parseInput(input), props.value[1]]
        // emit('input', [parseInput(input), props.value[1]])
      } else {
        internalValue.value = [props.value[0], parseInput(input)]
        // emit('input', [props.value[0], parseInput(input)])
      }
    }
    const valueString = computed(() => {
      if (props.value[0] === null && props.value[1] !== null) {
        return i18n.t(`${props.intervalLabels}.lessThanEquals`, {
          max: props.value[1],
        })
      }

      if (props.value[0] !== null && props.value[1] === null) {
        return i18n.t(`${props.intervalLabels}.greaterThanEquals`, {
          min: props.value[0],
        })
      }
      return i18n.t(`${props.intervalLabels}.between`, {
        min: props.value[0],
        max: props.value[1],
      })
    })
    const icons = computed(() => ({ mdiClose }))
    const handleRemove = () => {
      emit('input', [null, null])
    }

    return {
      handleInput,
      handleRemove,
      handleEnter,
      internalValue,
      valueString,
      icons,
    }
  },
})
</script>

<style lang="scss" scoped>
::v-deep .v-expansion-panel-content__wrap {
  padding-right: 8px;
  padding-left: 8px;
  padding-bottom: 8px;
}
.v-text-field {
  padding-top: 0px;
  margin-top: 0px;
}
.checkbox {
  accent-color: var(--v-accent-base);
}
</style>
