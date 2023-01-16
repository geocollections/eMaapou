<template>
  <v-expansion-panel ref="panel" style="background-color: transparent">
    <v-expansion-panel-header
      class="py-1 pl-2 pr-1 font-weight-medium"
      style="min-height: 40px; border-bottom: 1px solid lightgray !important"
    >
      {{ label }}
    </v-expansion-panel-header>
    <div
      v-if="validFilters.length > 0 && !isPanelOpen"
      class="white"
      style="
        border-bottom: 1px solid lightgray !important;
        border-right: 1px solid lightgray !important;
      "
    >
      <div
        v-for="(item, i) in validFilters"
        :key="i"
        class="d-flex py-1 selected-item px-2"
      >
        <span>
          <input
            type="checkbox"
            class="checkbox"
            checked
            @click.prevent.stop="handleRemove(i)"
          />
        </span>
        <span
          class="align-self-center text-body-2 font-weight-medium pl-2"
          style="word-break: break-word"
        >
          <slot name="selection" :item="item">
            <div>{{ parameterIndex[item.parameter] }}</div>
            <div class="font-weight-regular font-italic">
              {{ valueString(item.value) }}
            </div>
          </slot>
        </span>
      </div>
    </div>
    <v-expansion-panel-content
      color="white"
      style="
        border-bottom: 1px solid lightgray !important;
        border-right: 1px solid lightgray !important;
      "
    >
      <div
        v-for="(v, i) in internalValue"
        :key="i"
        class="pb-2"
        style="border-bottom: 1px solid lightgray !important"
      >
        <v-row no-gutters class="px-2">
          <v-col cols="8">
            <v-autocomplete
              :value="v.parameter"
              hide-details
              dense
              :placeholder="$t('filters.parameter')"
              persistent-placeholder
              :items="parameters"
              @input="handleParameter($event, i)"
            >
            </v-autocomplete>
          </v-col>
          <v-col class="d-flex justify-end">
            <v-btn class="mt-1" icon small @click="handleRemove(i)">
              <v-icon small>{{ icons.mdiClose }}</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="6" class="pl-2 pr-1">
            <v-text-field
              class="pt-4"
              hide-details
              type="number"
              :value="v.value[0]"
              step="0.1"
              dense
              persistent-placeholder
              :label="$t('common.from').toString()"
              @input="handleValue([parseInput($event), v.value[1]], i)"
              @keydown.enter.prevent.stop="handleEnter"
              @blur="handleEnter"
            />
          </v-col>

          <v-col cols="6" class="pl-1 pr-2">
            <v-text-field
              class="pt-4"
              hide-details
              type="number"
              :value="v.value[1]"
              step="0.1"
              persistent-placeholder
              dense
              :label="$t('common.to').toString()"
              @input="handleValue([v.value[0], parseInput($event)], i)"
              @keydown.enter.prevent.stop="handleEnter"
              @blur="handleEnter"
            />
          </v-col>
        </v-row>
      </div>
      <v-row no-gutters class="pt-2 px-2">
        <v-col cols="6">
          <v-btn
            small
            text
            block
            class="text-center"
            color="accent"
            :disabled="validFilters.length < 1"
            @click="handleClear"
          >
            Clear
          </v-btn>
        </v-col>

        <v-col cols="6">
          <v-btn
            small
            text
            block
            class="text-center"
            color="accent"
            :disabled="!isAddActive"
            @click="handleAdd"
          >
            Add
          </v-btn>
        </v-col>
      </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="ts">
import { mdiPlus, mdiMinus, mdiClose } from '@mdi/js'
import {
  computed,
  defineComponent,
  PropType,
  reactive,
  ref,
  toRefs,
  useContext,
  watch,
} from '@nuxtjs/composition-api'
import cloneDeep from 'lodash/cloneDeep'
import isEmpty from 'lodash/isEmpty'
import isNull from 'lodash/isNull'

interface IValue {
  value: (number | null)[]
  parameter: string | null
}

export default defineComponent({
  name: 'FilterInputParameter',
  props: {
    disableRemove: {
      type: Boolean,
      default: false,
    },
    disableAdd: {
      type: Boolean,
      default: false,
    },
    parameters: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Array as PropType<IValue[]>,
      required: true,
    },
    label: {
      type: String,
      default: 'Parameter',
    },
  },
  setup(props, { emit }) {
    const { i18n } = useContext()
    const icons = computed(() => ({ mdiPlus, mdiMinus, mdiClose }))
    const panel = ref()
    const state = reactive({
      internalValue: [{ value: [null, null], parameter: null }] as IValue[],
    })
    watch(
      () => props.value,
      (newVal) => {
        state.internalValue = cloneDeep(newVal)
      },
      { immediate: true }
    )
    const parseInput = (input: string) => {
      if (isEmpty(input)) return null
      return parseFloat(input)
    }

    const validateFilter = (filter: IValue) => {
      return !isNull(filter.parameter)
    }

    const handleValue = (value: IValue['value'], i: number) => {
      state.internalValue[i].value = value
    }
    const handleParameter = (value: IValue['parameter'], i: number) => {
      state.internalValue[i].parameter = value
      emit('input', state.internalValue)
    }

    const handleAdd = () => {
      state.internalValue = [
        ...state.internalValue,
        { value: [null, null], parameter: null },
      ]
    }
    const handleRemove = (i: number) => {
      if (state.internalValue.length <= 1) {
        state.internalValue = [{ parameter: null, value: [null, null] }]
        emit('input', state.internalValue)
        return
      }
      const cloneItems = cloneDeep(state.internalValue)
      cloneItems.splice(i, 1)
      state.internalValue = cloneItems
      emit('input', state.internalValue)
    }
    const handleClear = () => {
      state.internalValue = [{ parameter: null, value: [null, null] }]
      emit('input', state.internalValue)
    }
    const handleEnter = () => {
      emit('input', state.internalValue)
    }

    const isAddActive = computed(() => {
      if (state.internalValue.length >= 10) return false

      return !state.internalValue.some((v) => {
        return isNull(v.parameter) // || (isNull(v.value[0]) && isNull(v.value[1]))
      })
    })

    const validFilters = computed(() => {
      return state.internalValue.filter((v) => {
        return validateFilter(v)
      }) as { value: (number | null)[]; parameter: string }[]
    })

    const isPanelOpen = computed(() => {
      return panel.value?.isActive ?? false
    })
    const parameterIndex = computed(() => {
      return props.parameters.reduce(
        (prev: any, param: any): { [K: string]: string } => {
          return { ...prev, [param.value]: param.text }
        },
        {}
      ) as { [K: string]: string }
    })

    const valueString = (value: IValue['value']) => {
      if (value[0] === null && value[1] === null) {
        return i18n.t(`intervals.default.exists`)
      }
      if (value[0] === null && value[1] !== null) {
        return i18n.t(`intervals.default.lessThanEquals`, {
          max: value[1],
        })
      }

      if (value[0] !== null && value[1] === null) {
        return i18n.t(`intervals.default.greaterThanEquals`, {
          min: value[0],
        })
      }
      return i18n.t(`intervals.default.between`, {
        min: value[0],
        max: value[1],
      })
    }
    return {
      ...toRefs(state),
      icons,
      isAddActive,
      validFilters,
      panel,
      isPanelOpen,
      parameterIndex,
      valueString,
      parseInput,
      handleValue,
      handleParameter,
      handleAdd,
      handleRemove,
      handleClear,
      handleEnter,
    }
  },
  data() {
    return {
      parameter: {
        value: 'Ag_ppm',
        text: 'Ag (ppm)',
      },
    }
  },
  // methods: {
  //   parseInput(input) {
  //     if (isEmpty(input)) return null
  //     else return parseFloat(input)
  //   },
  //   handleParameter(newParameter) {
  //     if (newParameter) {
  //       this.parameter = newParameter

  //       this.$emit('input', {
  //         ...this.value,
  //         label: newParameter.text,
  //         fields: [newParameter.value],
  //       })
  //     }
  //   },
  //   handleValue(value) {
  //     this.$emit('input', { ...this.value, value })
  //   },
  // },
})
</script>

<style scoped>
::v-deep .v-expansion-panel-content__wrap {
  padding-right: 0px;
  padding-left: 0px;
  padding-bottom: 8px;
}
.checkbox {
  accent-color: var(--v-accent-base);
}
</style>
